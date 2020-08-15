import * as fs from 'fs';
import * as path from 'path';
import xmldom from 'xmldom';
import transpile from './transpile';
import {
  IItem,
  wildcard,
  wildcardToRegExp,
  wildcardToRegExpForPath,
} from './wildcard';
import optionalist from './optionalist';

/**
 * job要素にobject要素を追加する
 * @param jobElement object要素を追加するjob要素
 * @param progids object要素のid属性やprogid属性を取得するマップ。
 */
function appendObjectElements(
  jobElement: Element,
  progids: {[id: string]: string}
) {
  const doc = jobElement.ownerDocument!;
  // ソース中にdeclare const fso: Scripting.FileSystemObbjectのような記述を見つけたら
  // <object id="fso" progid="Scripting.FileSystemObbject">を追加する
  for (const id in progids) {
    if (!progids.hasOwnProperty(id)) {
      continue;
    }
    const progid = progids[id];
    const objectElement = doc.createElement('object');
    objectElement.setAttribute('id', id);
    objectElement.setAttribute('progid', progid);
    jobElement.appendChild(objectElement);
    jobElement.appendChild(doc.createTextNode('\n'));
  }
}

/**
 * job要素にscript要素を追加する。
 *
 * ついでにruntime要素も追加する。
 * @param jobElement script要素を追加するjob要素
 * @param script script要素の中身にするスクリプト
 */
function appendScriptElement(jobElement: Element, script: string) {
  const locator = {
    columnNumber: 0,
    lineNumber: 0,
    systemId: '',
  };
  const parser = new xmldom.DOMParser({
    errorHandler: (level, message) => {
      throw new Error(message);
    },
    locator,
  });
  const doc = jobElement.ownerDocument!;
  const scriptElement = doc.createElement('script');
  scriptElement.setAttribute('language', 'JScript');
  const reRuntime = /(?:^|\r?\n)[ \t]*\/{3}[ \t]*<wsh:runtime>[ \t]*\r?\n(?:[ \t]*\/{3}[^\r\n]*\r?\n)*?[ \t]*\/{3}[ \t]*<\/wsh:runtime>[ \t]*(?=$|\r?\n)/g;
  const content = script
    .replace(/^\ufeff/, '') // remove BOM
    .replace(/\r\n/g, '\n') // CRLF -> LF
    .replace(/^(?!\n)/, '\n') // insert LF to BOS
    .replace(/[^\n]$/, '$&\n') // append LF to EOS
    // `/// <wsh:runtime>`～ `/// </wsh:runtime>` をwsfファイルのruntime要素に出力
    .replace(reRuntime, rtContent => {
      const runtime = rtContent
        // 行頭の`///`は削除
        .replace(/^[ \t]*\/{3} ?/gm, '')
        // 要素名のプリフィックスwshは取り除く
        .replace(/(<\/?)wsh:/g, '$1');
      // XMLとしてパーズする
      const runtimeDoc = (() => {
        try {
          return parser.parseFromString(runtime);
        } catch (ex) {
          // runtime要素のparseに失敗したらエラー箇所を表示
          const lines = runtime.split(/\r?\n/);
          const pre = lines
            .slice(Math.max(locator.lineNumber - 4, 0), locator.lineNumber)
            .map(s => '| ' + s + '\n')
            .join('');
          const post = lines
            .slice(
              locator.lineNumber,
              Math.min(locator.lineNumber + 3, lines.length)
            )
            .map(s => '| ' + s + '\n')
            .join('');
          throw new Error(
            `${ex.message}\n${pre}${' '.repeat(
              2 + locator.columnNumber - 1
            )}^\n${post}`
          );
        }
      })();
      const runtimeElement = (() => {
        // 既にあればそのまま使用
        const elements = jobElement.getElementsByTagName('runtime');
        if (elements.length) {
          return elements[0];
        }
        // 無ければ作成
        const element = doc.createElement('runtime');
        jobElement.appendChild(element);
        jobElement.appendChild(doc.createTextNode('\n'));
        return element;
      })();
      for (
        let child: Node | null = runtimeDoc.documentElement!.firstChild;
        child;
        child = child.nextSibling
      ) {
        runtimeElement.appendChild(doc.importNode(child, true));
      }
      // `/// <wsh:runtime>`自体が出力コードに残らないように削除
      return '';
    });
  // scriptはCDATAセクションで追加する
  scriptElement.appendChild(doc.createCDATASection(content));
  jobElement.appendChild(scriptElement);
  jobElement.appendChild(doc.createTextNode('\n'));
  return scriptElement;
}

// ソースファイルの依存関係を記憶するためのインターフェイス
interface IDependencies {
  [filepath: string]: {
    [filepath: string]: true;
  };
}

const dom = new xmldom.DOMImplementation();
const serializer = new xmldom.XMLSerializer();
// ポリフィルを追加(TypeScriptで記述してコンパイルしたもの)
const polyfill = fs.promises.readFile(
  path.join(__dirname, '../polyfill/index.js'),
  'utf-8'
);

async function makeWsfDom(transpiled: string, progids: {[id: string]: string}) {
  const script =
    (await polyfill) +
    // Symbol.forはforが予約語のためエラーになるのでSymbol['for']に置き換える
    transpiled.replace(/\bSymbol\s*\.\s*for\b/g, `Symbol['for']`)
    // テンプレートリテラル内の日本語がエスケープされてしまうのでデコード
    .replace(/\\u([0-9a-f]{4})/ig, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  // WSFファイルの生成
  const doc = dom.createDocument(null, 'job', null);
  const jobElement = doc.documentElement!;
  jobElement.appendChild(doc.createTextNode('\n'));
  // object要素の追加
  appendObjectElements(jobElement, progids);
  // script要素の追加(あればruntime要素も)
  appendScriptElement(jobElement, script);
  return doc;
}

/**
 * WSFをファイルに出力
 * @param filepath ソースファイルのパス
 * @param doc WSFのドキュメント
 */
async function writeWsf(filepath: string, doc: Document) {
  const content =
    '<?xml version="1.0" encoding="utf-8" ?>\n' +
    serializer.serializeToString(doc) +
    '\n';
  // コンソールモードの場合は標準出力に表示して終了
  if (options.console) {
    process.stdout.write(`${filepath}:\n`);
    process.stdout.write(content);
    process.stdout.write('\n');
    return;
  }
  const outputPath =
    // outputの指定が無ければソースファイルの拡張子をWSFに変えたものに出力
    !options.output
      ? filepath.replace(/\.ts$/, '.wsf')
      : // outputに拡張子WSFのファイル名が指定されていればそのまま使用
      /\.wsf$/i.test(options.output)
      ? options.output
      : // outputに拡張子WSFが指定されていなければディレクトリと見なして
        // そこにファイル名をソースファイルの拡張子をWSFに変えたものに出力
        path.join(options.output, path.basename(filepath, '.ts') + '.wsf');
  const existent = await fs.promises.readFile(outputPath, 'utf8').catch(err => {
    if (err.code === 'ENOENT') {
      // 存在してなかった場合には空のファイルと同じ扱い
      return '';
    }
    // その他のエラーはエラーとして扱う
    throw err;
  });
  if (existent === content) {
    // 既存のファイルと内容が同じならタイムスタンプが変わらないように出力しない
    process.stdout.write(`\t\t変化なし: ${outputPath}\n`);
  } else {
    await fs.promises.writeFile(outputPath, content, 'utf8');
    process.stdout.write(`\t\t出力先: ${outputPath}\n`);
  }
}

/**
 * tsc4wshを実行する
 * @param filepaths ワイルドカード展開済みのファイルリスト
 * @param dependencies ソースファイルの依存関係を格納するインスタンス
 * @param watchMode 監視モードかどうか
 */
async function tsc4wsh(
  filepaths: string[],
  dependencies?: IDependencies,
  watchMode?: boolean
) {
  process.stdout.write(
    `${new Date().toLocaleTimeString()} - tsc4wsh 開始 ${
      watchMode ? ' (監視中)' : ''
    }...\n`
  );

  try {
    // 指定されたファイルを並列にコンパイル
    return (await Promise.all(
      filepaths.map(async filepath => {
        process.stdout.write(`  ${filepath}\n`);
        try {
          // TSファイル以外は対象外
          if (path.extname(filepath).toLowerCase() !== '.ts') {
            throw new Error('サポートしていないファイルです。');
          }
          const {script: transpiled, objectMap: progids} = transpile(
            filepath,
            dependencies
          );
          const doc = await makeWsfDom(transpiled, progids);
          await writeWsf(filepath, doc);
          return true;
        } catch (ex) {
          // エラーメッセージはすべて例外として受け取る
          const message =
            typeof ex.message !== 'string'
              ? ex.toString()
              : ex.message
                  // LF/CRLFで始まっていなければLFを先頭に挿入
                  .replace(/^(?!\r?\n)/, '\n')
                  // LF/CRLFで終わっていなければLFを最後に追加
                  .replace(/[^\r\n](?!\r?\n)$/, '$&\n')
                  // 各行の行頭にインデントを二つ挿入
                  .replace(/^(?=.)/gm, `    `);
          process.stderr.write(`    エラー: ${filepath}${message}`);
          return false;
        }
      })
    )).every(r => r);
  } finally {
    process.stdout.write(
      `${new Date().toLocaleTimeString()} - tsc4wsh 終了.\n`
    );
  }
}

const options = optionalist.parse({
  [optionalist.helpString]: {
    describ: `Windows Scripting Host向けTypeScriptコンパイラ`,
  },
  output: {
    alias: 'o',
    example: 'outputDirOrFile',
    describe: `出力先ディレクトリ、もしくは出力先ファイルを指定する。
              拡張子'.wsf'を付けると出力先ファイルと見なす。
              変換対象を複数指定した場合、出力先にファイルを指定するとエラーとなる。`,
  },
  base: {
    alias: 'b',
    example: 'baseDir',
    describe: `基準ディレクトリを指定する。`,
  },
  watch: {
    alias: 'w',
    describe: `ファイルの更新監視を開始するかどうか。`,
    type: 'boolean',
  },
  help: {
    alias: 'h',
    describe: `このヘルプを表示する。`,
    type: 'boolean',
    alone: true,
  },
  init: {
    alias: 'i',
    describe: `tsconfig.jsonを生成する。`,
    type: 'boolean',
    alone: true,
  },
  console: {
    alias: 'c',
    describe: `変換結果をファイルではなく標準出力に表示する。`,
    type: 'boolean',
  },
  [optionalist.unnamed]: {
    example: 'filename',
    describe: `コンパイルするファイル
              ファイル名にはワイルドカードを指定可能。
              - * はファイル名、ディレクトリ名の任意の0個以上複数文字にマッチ
              - ? はファイル名、ディレクトリ名の任意の1文字にマッチ
              - {AAA,BBB}はファイル名、ディレクトリ名のAAAかBBBにマッチ
              - ** は下階層のすべてのファイル、ディレクトリにマッチ
              ファイル名を指定しなかった場合には**\\*.tsが指定されたものと見なす。
              -で始まるファイル名を使用したい場合には--を指定したあとにファイル名を指定する。
              ただし、その場合--以降でその他のオプションは指定できない。`,
  },
});

async function ensureDir(p: string) {
  const d = path.dirname(p);
  // 存在確認だけでなくディレクトリかどうかもチェック
  const stat = await fs.promises.stat(d).catch(ex => {
    if (ex.code === 'ENOENT') {
      return null;
    }
    throw ex;
  });
  if (stat?.isDirectory()) {
    // ディレクトリとして存在していれば何もしないで終了
    return;
  }
  await ensureDir(d);
  await fs.promises.mkdir(d);
}

if (options.help) {
  process.stderr.write(options[optionalist.helpString]);
  process.exit(1);
}

if (options.init) {
  transpile.generateTSConfig();
  process.exit(0);
}

// ファイル指定なしの場合はカレントディレクトリ以下にあるすべてのtsファイルを対象とする
const patterns = options[optionalist.unnamed].length > 0 ? options[optionalist.unnamed] : ['**/*.ts'];

let gitIgnore: ( (item: IItem) => boolean | undefined) | undefined;
// ワイルドカードを展開
const filelist = patterns
  .map(pattern => [
    ...wildcard(pattern, item => {
      if (item.stat.isDirectory()) {
        gitIgnore = loadGitignore(item.path, gitIgnore);
      }
      return gitIgnore?.(item);
    }),
  ])
  .reduce((a, b) => a.concat(b))
  .map(item => item.path);

if (filelist.length === 0) {
  process.stderr.write(
    `ファイルが見つかりません。: \n${patterns.map(s => `    ${s}\n`).join('')}`
  );
  process.exit(1);
}

if (options.output && /\.wsf$/i.test(options.output) && filelist.length > 1) {
  process.stderr.write(
    `複数のソースファイルが指定されましたが、出力先にファイルが指定されています。: ${
      options.output
    }\n`
  );
  process.exit(1);
}
if (options.watch && options.console) {
  process.stderr.write(
    `ファイル更新監視時は変換結果の出力先に標準出力を指定できません。\n`
  );
  process.exit(1);
}

(async () => {
  if (options.output) {
    const output = /\.wsf$/i.test(options.output) ? options.output : path.join(options.output, 'dummy.wsf');
    await ensureDir(output);
  }

  if (!options.watch) {
    const result = await tsc4wsh(filelist);
    process.exit(result ? 0 : 1);
  }

  let timerId: NodeJS.Timer | undefined;
  let scheduled: {[filepath: string]: true} = {};
  const dependencies: {[filepath: string]: {[filepath: string]: true}} = {};
  await tsc4wsh(filelist, dependencies);
  for (const filepath of Object.keys(dependencies)) {
    fs.watch(filepath, () => {
      if (timerId) {
        clearTimeout(timerId);
      }
      const map = dependencies[filepath];
      if (!map) {
        return;
      }
      for (const source of Object.keys(map)) {
        scheduled[source] = true;
      }
      timerId = setTimeout(() => {
        timerId = undefined;
        const activated = Object.keys(scheduled);
        scheduled = {};
        // ビルドするファイルの依存関係をクリア
        for (const f of Object.keys(dependencies)) {
          for (const s of activated) {
            delete dependencies[f][s];
          }
        }
        tsc4wsh(activated, dependencies, true);
      }, 1000);
    });
  }
})();

function loadGitignore(dirpath: string, filterFunc?: (item: IItem) => boolean | undefined) {
  const gitignorePath = path.join(dirpath, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    return filterFunc;
  }
  if (!fs.statSync(gitignorePath).isFile()) {
    return filterFunc;
  }
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  const gitignore = gitignoreContent
    .split(/(?:\r?\n)+/)
    // #で始まる行はコメント
    .filter(line => line && !/^#/.test(line))
    .map(line => {
      let pattern = line;
      let directoryOnly = false;
      let negative = false;
      // /で終わっていればディレクトリだけにマッチ
      if (/\/$/.test(pattern)) {
        pattern = pattern.replace(/\/+/, '');
        directoryOnly = true;
      }
      // `!`で始まっていればそれまでにマッチしていたものがあっても除外
      if (/^!/.test(pattern)) {
        pattern = pattern.substr(1);
        negative = true;
      }
      // 先頭に\があれば次の文字をエスケープ
      pattern = pattern.replace(/^\\/, '');
      // /を含むパターンは.gitignoreのあるディレクトリからの相対パス
      const nameOnly = !pattern.includes('/');
      // 先頭の/は除外して正規表現に変換
      if (/^\//.test(pattern)) {
        pattern = pattern.substr(1);
      }
      // 名前だけかパスを含むかで正規表現への変換方法を変える
      const re = nameOnly
        ? wildcardToRegExp(pattern)!
        : wildcardToRegExpForPath(pattern)!;
      return {directoryOnly, negative, nameOnly, re};
    });
  return (item: IItem) => {
    let state: boolean | undefined;
    // .gitignoreからの相対パス
    const rel = path.relative(dirpath, item.path).replace(/\\/g, '/');
    if (rel.startsWith('../')) {
      // .gitignoreのあるディレクトリ以下にあるファイル/ディレクトリではないのでスキップ
      return filterFunc?.(item);
    }
    for (const pattern of gitignore) {
      // ディレクトリにだけマッチするものはディレクトリ以外のときはスキップ
      if (pattern.directoryOnly && !item.stat.isDirectory()) {
        continue;
      }
      // パターンにマッチしないものはスキップ
      if (pattern.nameOnly) {
        // 名前だけにマッチするものは名前だけをチェック
        if (!pattern.re.test(item.name)) {
          continue;
        }
      } else {
        // .gitignoreからの相対パスでチェック
        if (!pattern.re.test(rel)) {
          continue;
        }
      }
      // パターンにマッチしたら反転かどうかによって状態を変更
      state = !pattern.negative;
    }
    if (state === undefined) {
      // 現在の.gitignoreにあるパターンすべてにマッチしない場合は親フォルダのパターンをチェック
      return filterFunc?.(item);
    }
    return state;
  };
}

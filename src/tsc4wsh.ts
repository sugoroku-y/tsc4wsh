/* globals Node Document Element */
import * as fs from 'fs';
import * as path from 'path';
import xmldom from 'xmldom';
import {transpile} from './transpile';

interface IWriteStream {
  write(s: string, ...args: any[]): any;
  close(): any;
}
export let stdout: IWriteStream = {
  write(s) {
    /* istanbul ignore next */
    process.stdout.write(s);
  },
  close() {},
};
export let stderr: IWriteStream = {
  write(s) {
    /* istanbul ignore next */
    process.stderr.write(s);
  },
  close() {},
};

export function setOutput(stream: IWriteStream): void {
  stdout.close();
  stdout = stream;
}
export function setError(stream: IWriteStream): void {
  stderr.close();
  stderr = stream;
}
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
    /* istanbul ignore next */ // eslint-disable-next-line no-prototype-builtins
    if (!progids.hasOwnProperty(id)) {
      /* istanbul ignore next */
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
 * @param runtimes runtime要素の中身
 * @param vbscripts script要素の中身にするVBScript
 */
function appendScriptElement(
  jobElement: Element,
  script: string,
  runtimes: string[],
  vbscripts: string[]
) {
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
  const content = script
    .replace(/^\ufeff/, '') // remove BOM
    .replace(/\r\n/g, '\n') // CRLF -> LF
    .replace(/^(?!\n)/, '\n') // insert LF to BOS
    .replace(/[^\n]$/, '$&\n'); // append LF to EOS
  // WshRuntimeテンプレートリテラルがあったらruntime要素を追加
  if (runtimes.length) {
    // `` WshRuntime`～` `` をXMLとしてパーズする
    const runtime = `<WshRuntime>${runtimes.join('')}</WshRuntime>`;
    const runtimeDoc = (() => {
      try {
        return parser.parseFromString(runtime);
      } catch (ex) {
        // runtime要素のparseに失敗したらエラー箇所を表示
        const lines = runtime.split(/\r?\n/);
        // エラー箇所より前(最大)3行
        const pre = lines
          .slice(Math.max(locator.lineNumber - 4, 0), locator.lineNumber)
          .map(s => '| ' + s)
          .join('\n');
        // エラー箇所より後(最大)3行
        const post = lines
          .slice(
            locator.lineNumber,
            Math.min(locator.lineNumber + 3, lines.length)
          )
          .map(s => '| ' + s)
          .join('\n');
        throw new Error(
          `${pre}
${' '.repeat(2 + locator.columnNumber - 1)}^${ex.message
            .replace(/\[xmldom (\w+)\]/g, '[$1]')
            .replace(/^@#\[line:\d+,col:\d+\]$/gm, '')
            .replace(/\s+/g, ' ')
            .split(/:\s*Error:\s*/)
            .join('\n' + ' '.repeat(2 + locator.columnNumber))}
${post}
`
        );
      }
    })();
    const runtimeElement = (() => {
      // 既にあればそのまま使用
      const elements = jobElement.getElementsByTagName('runtime');
      /* istanbul ignore next */
      if (elements.length) {
        /* istanbul ignore next */
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
  }
  // VBScript用script要素を追加
  for (const content of vbscripts) {
    const scriptElement = doc.createElement('script');
    scriptElement.setAttribute('language', 'VBScript');
    scriptElement.appendChild(doc.createCDATASection(content));
    jobElement.appendChild(scriptElement);
    jobElement.appendChild(doc.createTextNode('\n'));
  }
  // scriptはCDATAセクションで追加する
  const scriptElement = doc.createElement('script');
  scriptElement.setAttribute('language', 'JScript');
  scriptElement.appendChild(doc.createCDATASection(content));
  jobElement.appendChild(scriptElement);
  jobElement.appendChild(doc.createTextNode('\n'));
  return scriptElement;
}

const dom = new xmldom.DOMImplementation();
const serializer = new xmldom.XMLSerializer();
// ポリフィルを追加(TypeScriptで記述してコンパイルしたもの)
const polyfill = fs.promises.readFile(
  path.join(__dirname, '../polyfill/index.js'),
  'utf-8'
);

async function makeWsfDom(
  transpiled: string,
  progids: {[id: string]: string},
  runtimes: string[],
  vbscripts: string[]
) {
  const script = (await polyfill) + transpiled;
  // WSFファイルの生成
  const doc = dom.createDocument(null, 'job', null);
  const jobElement = doc.documentElement!;
  jobElement.appendChild(doc.createTextNode('\n'));
  // object要素の追加
  appendObjectElements(jobElement, progids);
  // script要素の追加(あればruntime要素も)
  appendScriptElement(jobElement, script, runtimes, vbscripts);
  return doc;
}

/**
 * WSFをファイルに出力
 * @param filepath ソースファイルのパス
 * @param doc WSFのドキュメント
 */
async function writeWsf(
  filepath: string,
  doc: Document,
  options: {console?: boolean; output?: string}
) {
  const content =
    '<?xml version="1.0" encoding="utf-8" ?>\n' +
    serializer.serializeToString(doc) +
    '\n';
  // コンソールモードの場合は標準出力に表示して終了
  /* istanbul ignore next */
  if (options.console) {
    /* istanbul ignore next */
    stdout.write(`${filepath}:\n`);
    /* istanbul ignore next */
    stdout.write(content);
    /* istanbul ignore next */
    stdout.write('\n');
    /* istanbul ignore next */
    return;
  }
  const outputPath =
    // outputの指定が無ければソースファイルの拡張子をWSFに変えたものに出力
    !options.output
      ? /* istanbul ignore next */
        filepath.replace(/\.ts$/, '.wsf')
      : // outputに拡張子WSFのファイル名が指定されていればそのまま使用
      /* istanbul ignore next */
      /\.wsf$/i.test(options.output)
      ? /* istanbul ignore next */
        options.output
      : // outputに拡張子WSFが指定されていなければディレクトリと見なして
        // そこにファイル名をソースファイルの拡張子をWSFに変えたものに出力
        /* istanbul ignore next */
        path.join(options.output, path.basename(filepath, '.ts') + '.wsf');
  const existent = await fs.promises.readFile(outputPath, 'utf8').catch(err => {
    /* istanbul ignore next */
    if (err.code === 'ENOENT') {
      // 存在してなかった場合には空のファイルと同じ扱い
      return '';
    }
    // その他のエラーはエラーとして扱う
    /* istanbul ignore next */
    throw err;
  });
  /* istanbul ignore next */
  if (existent === content) {
    // 既存のファイルと内容が同じならタイムスタンプが変わらないように出力しない
    /* istanbul ignore next */
    stdout.write(`\t\t変化なし: ${outputPath}\n`);
  } else {
    await fs.promises.writeFile(outputPath, content, 'utf8');
    stdout.write(`\t\t出力先: ${outputPath}\n`);
  }
}

/**
 * tsc4wshを実行する
 * @param filepaths ワイルドカード展開済みのファイルリスト
 * @param dependencies ソースファイルの依存関係を格納するインスタンス
 * @param watchMode 監視モードかどうか
 */
export async function tsc4wsh(
  filepaths: string[],
  options: {console?: boolean; output?: string; watch?: boolean}
) {
  stdout.write(
    `${new Date().toLocaleTimeString()} - tsc4wsh 開始 ${
      /* istanbul ignore next */
      options.watch ? ' (監視中)' : ''
    }...\n`
  );

  try {
    // 指定されたファイルをコンパイル
    stdout.write(`  ${filepaths.join(', ')}\n`);
    try {
      // TSファイル以外は対象外
      /* istanbul ignore next */
      if (
        filepaths.some(
          filepath => path.extname(filepath).toLowerCase() !== '.ts'
        )
      ) {
        /* istanbul ignore next */
        throw new Error('サポートしていないファイルです。');
      }
      const {script, objectMap, runtimes, vbscripts} = transpile(filepaths);
      const doc = await makeWsfDom(script, objectMap, runtimes, vbscripts);
      await writeWsf(filepaths[0], doc, options);
      return true;
    } catch (ex) {
      // エラーメッセージはすべて例外として受け取る
      const message =
        typeof ex.message !== 'string'
          ? /* istanbul ignore next */
            ex.toString()
          : ex.message
              // LF/CRLFで始まっていなければLFを先頭に挿入
              .replace(/^(?!\r?\n)/, '\n')
              // LF/CRLFで終わっていなければLFを最後に追加
              .replace(/[^\r\n](?!\r?\n)$/, '$&\n')
              // 各行の行頭にインデントを二つ挿入
              .replace(/^(?=.)/gm, `    `);
      stderr.write(`    エラー: ${filepaths[0]}${message}`);
      return false;
    }
  } finally {
    stdout.write(`${new Date().toLocaleTimeString()} - tsc4wsh 終了.\n`);
  }
}

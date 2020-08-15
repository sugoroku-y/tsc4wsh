import * as fs from 'fs';
import * as optimist from 'optimist';
import * as os from 'os';
import * as path from 'path';
import {promisify} from 'util';
import * as xmldom from 'xmldom';
import {generateTSConfig, transpile} from './transpile';

const fsExists = promisify(fs.exists);
const fsMkdir = promisify(fs.mkdir);
const fsWriteFile = promisify(fs.writeFile);
const fsReadFile = promisify(fs.readFile);

export function wildcardToRegExp(pattern: string): RegExp | undefined {
  if (!pattern) {
    return undefined;
  }
  if (pattern.includes('\\')) {
    throw new Error(`Unsupported wildcard: ${pattern}`);
  }
  let depth = 0;
  const regex =
    '^' +
    pattern.replace(/[\^$()\[\]{}+.*?;]/g, ch => {
      switch (ch) {
        case '*':
          return '.*';
        case '?':
          return '.';
        case '{':
          ++depth;
          return '(?:';
        case '}':
          if (depth <= 0) {
            throw new Error('Unmatched `}`');
          }
          --depth;
          return ')';
        case ',':
          return depth > 0 ? '|' : ',';
        default:
          return '\\' + ch;
      }
    }) +
    '$';
  if (depth > 0) {
    throw new Error('Unmatched `{`');
  }
  return new RegExp(regex, 'i');
}
interface IItem {
  path: string;
  name: string;
  stat: fs.Stats;
}
function* recursiveFolderAndFiles(
  dir: string,
  filter?: (item: IItem) => any
): IterableIterator<IItem> {
  yield* (function* sub(item: IItem): IterableIterator<IItem> {
    yield item;
    if (!item.stat.isDirectory()) {
      return;
    }
    for (const name of fs.readdirSync(item.path)) {
      const fullpath = path.join(dir, name);
      const stat = fs.statSync(fullpath);
      const childItem = {path: fullpath, name, stat};
      if (filter && filter(childItem)) {
        continue;
      }
      yield* sub(childItem);
    }
  })({path: dir, stat: fs.statSync(dir), name: path.basename(dir)});
}
function* recursiveFolders(dir: string) {
  yield* recursiveFolderAndFiles(
    dir,
    (item: IItem) => !item.stat.isDirectory()
  );
}
/**
 * 指定されたパターンにマッチする全てのファイル/フォルダを順次返すイテレータを返す。
 * @param pattern 検索するファイル/フォルダ名のパターン。
 *
 * - `**`はそれ以下の全てのパス
 * - `?`は名前に使用される全ての1文字
 * - `*`は0以上の名前に使用される全ての文字
 *
 * にマッチする。
 * @param basedir 検索を開始するディレクトリへのパス。省略時にはカレントディレクトリ。
 */
export function* wildcard(pattern: string, basedir?: string) {
  const fullpath = path.resolve(basedir || '.', pattern);
  const {root} = path.parse(fullpath);
  const pathes = fullpath
    .substr(root.length)
    .split(/\\+/)
    .map((pathAtom, index, array) => {
      if (pathAtom === '') {
        return function*(f: string) {
          const stat = fs.statSync(f);
          yield {path: f, name: path.basename(f), stat};
        };
      }
      const last = index + 1 === array.length;
      if (pathAtom === '**') {
        return last ? recursiveFolderAndFiles : recursiveFolders;
      }
      if (/[*?]|\{[^*?{};\\]+(?:;[^*?{};\\]+)*\}/.test(pathAtom)) {
        const atomPattern = wildcardToRegExp(pathAtom);
        if (!atomPattern) {
          throw new Error('');
        }
        return function*(ff: string) {
          yield* fs
            .readdirSync(ff)
            .map(name => {
              const childFullpath = path.join(ff, name);
              return {
                name,
                path: childFullpath,
                stat: fs.statSync(childFullpath),
              };
            })
            .filter(
              p => (last || p.stat.isDirectory()) && atomPattern.test(p.name)
            );
        };
      }
      return function*(ff: string) {
        const lastpath = path.resolve(ff, pathAtom);
        if (fs.existsSync(lastpath)) {
          const stat = fs.statSync(lastpath);
          if (last || stat.isDirectory()) {
            yield {path: lastpath, name: path.basename(lastpath), stat};
          }
          return;
        }
      };
    });
  yield* (function* traverse(
    ff: string,
    index: number
  ): IterableIterator<IItem> {
    if (index + 1 === pathes.length) {
      yield* pathes[index](ff);
      return;
    }
    for (const item of pathes[index](ff)) {
      if (!item.stat.isDirectory()) {
        continue;
      }
      yield* traverse(item.path, index + 1);
    }
  })(root, 0);
}

function appendScriptElement(jobElement: Element, script: string) {
  const parser = new xmldom.DOMParser();
  const doc = jobElement.ownerDocument;
  if (!doc) {
    throw new Error();
  }
  const scriptElement = doc.createElement('script');
  scriptElement.setAttribute('language', 'JScript');
  const content = script
    .replace(/^\ufeff/, '') // remove BOM
    .replace(/\r\n/g, '\n') // CRLF -> LF
    .replace(/^(?!\n)/, '\n') // insert LF to BOS
    .replace(/[^\n]$/, '$0\n') // append LF to EOS
    .replace(
      // tslint:disable-next-line:max-line-length
      /(?:^|\r?\n)[ \t]*\/{3}[ \t]*<wsh:runtime>[ \t]*\r?\n(?:[ \t]*\/{3}[^\r\n]*\r?\n)*?[ \t]*\/{3}[ \t]*<\/wsh:runtime>[ \t]*(?=$|\r?\n)/g,
      rtContent => {
        // `/// <wsh:runtime>`～ `/// </wsh:runtime>` をwsfファイルのruntime要素に出力
        const runtime = rtContent
          // 行頭の`///`は削除
          .replace(/^[ \t]*\/{3} ?/gm, '')
          // 要素名のプリフィックスwshは取り除く
          .replace(/(<\/?)wsh:/g, '$1');
        const runtimeDoc = parser.parseFromString(runtime);
        const runtimeElement = (() => {
          const elements = jobElement.getElementsByTagName('runtime');
          if (elements.length) {
            return elements[0];
          }
          const element = doc.createElement('runtime');
          jobElement.insertBefore(element, jobElement.firstChild);
          return element;
        })();
        if (!runtimeDoc.documentElement) {
          throw new Error();
        }
        for (
          let child: Node | null = runtimeDoc.documentElement.firstChild;
          child;
          child = child.nextSibling
        ) {
          runtimeElement.appendChild(doc.importNode(child, true));
        }
        // `/// <wsh:runtime>`自体が出力コードに残らないように削除
        return '';
      }
    );
  scriptElement.appendChild(doc.createCDATASection(content));
  jobElement.appendChild(scriptElement);
  return scriptElement;
}

interface IDependencies {
  [filepath: string]: {
    [filepath: string]: true;
  };
}

const dom = new xmldom.DOMImplementation();
const serializer = new xmldom.XMLSerializer();
// Symbolのポリフィルは関数として宣言しなければうまく動かない(その上、TypeScriptで関数として書くと標準の宣言、定義に邪魔されてコンパイルが通らない)のでJavaScriptで記述
const polyfill =
  fs.readFileSync(path.join(__dirname, '../polyfill/symbol.js'), 'utf-8') +
  // その他のポリフィルも一緒に追加(こちらはTypeScriptで記述してコンパイルしたもの)
  fs.readFileSync(path.join(__dirname, '../polyfill/index.js'), 'utf-8');

async function tsc4wsh(
  filepaths: string[],
  dependencies?: IDependencies,
  watchMode?: boolean
) {
  process.stdout.write(
    `${new Date().toLocaleTimeString()} - 変換開始 ${
      watchMode ? ' (監視中)' : ''
    }...${os.EOL}`
  );
  const promises: Array<Promise<void>> = [];
  for (const filepath of filepaths) {
    promises.push(
      (async () => {
        process.stdout.write(`\t${filepath}${os.EOL}`);
        if (!path.extname(filepath).match(/\.ts$/i)) {
          process.stderr.write(
            `${filepath}:エラー: サポートしていないファイルです。${os.EOL}`
          );
          return;
        }
        const r = await transpile(filepath, dependencies).catch(err => {
          // transpile中のエラーは例外で来るので表示
          process.stderr.write(`${err.toString()}${os.EOL}`);
          return null;
        });
        // エラー発生時のメッセージ表示は上記で終わっているのでそのまま返る
        if (!r) {
          return;
        }
        const {script: transpiled, objectMap: progids} = r;
        const script =
          polyfill +
          transpiled.replace(/\bSymbol\s*\.\s*for\b/g, `Symbol['for']`);
        const doc = (() => {
          try {
            const wsfDoc = dom.createDocument(null, 'job', null);
            const jobElement = wsfDoc.documentElement;
            if (!jobElement) {
              throw new Error();
            }
            jobElement.appendChild(wsfDoc.createTextNode('\n'));
            appendScriptElement(jobElement, script);
            // ソース中にdeclare condt fso: Scripting.FileSystemObbjectのような記述を見つけたら
            // <object id="fso" progid="Scripting.FileSystemObbject">を追加する
            for (const id in progids) {
              if (!progids.hasOwnProperty(id)) {
                continue;
              }
              const progid = progids[id];
              const objectElement = wsfDoc.createElement('object');
              objectElement.setAttribute('id', id);
              objectElement.setAttribute('progid', progid);
              jobElement.insertBefore(objectElement, jobElement.firstChild);
              jobElement.insertBefore(
                wsfDoc.createTextNode('\n'),
                jobElement.firstChild
              );
            }
            jobElement.appendChild(wsfDoc.createTextNode('\n'));
            return wsfDoc;
          } catch (ex) {
            process.stdout.write(`${filepath}:エラー: ${ex.message}${os.EOL}`);
            return undefined;
          }
        })();
        if (!doc) {
          return;
        }
        const content =
          '<?xml version="1.0" encoding="utf-8" ?>\n' +
          serializer.serializeToString(doc) +
          '\n';
        if (options.console) {
          process.stdout.write(content);
        } else {
          async function ensureDir(p: string) {
            const d = path.dirname(p);
            if (await fsExists(d)) {
              return;
            }
            await ensureDir(d);
            await fsMkdir(d);
          }
          const outputPath = options.output
            ? /\.wsf$/i.test(options.output)
              ? options.output
              : options.output + '.wsf'
            : /\.ts$/i.test(filepath)
            ? filepath.replace(/\.ts$/i, '.wsf')
            : filepath + '.wsf';
          try {
            await ensureDir(outputPath);
            if (
              (await fsExists(outputPath)) &&
              (await fsReadFile(outputPath, 'utf8')) === content
            ) {
              process.stdout.write(`\t\t変化なし: ${outputPath}${os.EOL}`);
            } else {
              await fsWriteFile(outputPath, content, 'utf8');
              process.stdout.write(`\t\t出力先: ${outputPath}${os.EOL}`);
            }
          } catch (ex) {
            process.stdout.write(
              `${filepath}:エラー: ${ex.message}: ${outputPath}${os.EOL}`
            );
          }
        }
      })()
    );
  }
  await Promise.all(promises);
  process.stdout.write(
    `${new Date().toLocaleTimeString()} - 変換終了.${os.EOL}`
  );
}

const optimistParser = optimist.options({
  o: {
    alias: 'output',
    describe: '出力先ディレクトリ、もしくは出力先ファイルを指定する。',
  },
  // tslint:disable-next-line:object-literal-sort-keys
  b: {
    alias: 'base',
    describe: '基準ディレクトリを指定する。',
  },
  w: {
    alias: 'watch',
    describe: 'ファイルの更新監視を開始するかどうか。',
    type: 'boolean',
  },
  h: {
    alias: 'help',
    describe: 'このヘルプを表示する。',
    type: 'boolean',
  },
  i: {
    alias: 'init',
    describe: 'tsconfig.jsonを生成して初期化する。',
    type: 'boolean',
  },
  c: {
    alias: 'console',
    describe: '変換結果をファイルではなく標準出力に表示する。',
    type: 'boolean',
  },
});
const options = optimistParser.argv as {
  output?: string;
  base?: string;
  watch?: boolean;
  help?: boolean;
  init?: boolean;
  console?: boolean;
  _: string[];
};
(async () => {
  if (options.init) {
    await generateTSConfig();
    process.exit(0);
  }
  if (options._.length === 0 || options.help) {
    optimistParser.showHelp();
    process.exit(1);
  }
  if (options._.length > 1 && options.output) {
    process.stderr.write(
      `複数のソースファイルが指定されましたが、出力先にファイルが指定されています。: ${
        options.output
      }${os.EOL}`
    );
    process.exit(1);
  }

  const filelist = [
    ...options._.map(p => [...wildcard(p)]).reduce((a, b) => a.concat(b)),
  ].map(item => item.path);
  if (!options.watch) {
    await tsc4wsh(filelist);
    process.exit(0);
  }

  if (options.console) {
    process.stderr.write(
      `ファイル更新監視時は変換結果の出力先に標準出力を指定できません。${
        os.EOL
      }`
    );
    process.exit(1);
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

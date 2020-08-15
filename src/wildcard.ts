import * as fs from 'fs';
import * as path from 'path';

/**
 * ワイルドカードのパターン文字列を正規表現に変換する。
 *
 * ただし変換するのはファイル名、フォルダ名に一致するパターンのみ。
 *
 * 複数階層に渡るワイルドカードはサポートしない。
 *
 * @param pattern {string} ワイルドカードのパターン文字列。
 * @return {RegExp} ワイルドカードのパターンから変換した正規表現。
 */
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
    pattern.replace(/[\^$()\[\]{}+.*?,]/g, ch => {
      switch (ch) {
        // *は0個以上のすべての文字にマッチ
        case '*':
          return '.*';
        // ?は1つのすべての文字にマッチ
        case '?':
          return '.';
        // {AAA,BBB}はAAAとBBBにマッチ(ネストも可))
        case '{':
          ++depth;
          return '(?:';
        case '}':
          if (depth <= 0) {
            throw new Error('Unmatched `}`');
          }
          --depth;
          return ')';
        // {}の中にない,はただの,として扱う
        case ',':
          return depth > 0 ? '|' : ',';
        // その他の正規表現で使われる文字は\でエスケープ
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

/**
 * ファイルやディレクトリの情報を扱うインターフェイス
 */
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
    if (filter && filter(item)) {
      return;
    }
    yield item;
    if (!item.stat.isDirectory()) {
      return;
    }
    for (const name of fs.readdirSync(item.path)) {
      const fullpath = path.join(dir, name);
      const stat = fs.statSync(fullpath);
      const childItem = {path: fullpath, name, stat};
      yield* sub(childItem);
    }
  })({path: dir, stat: fs.statSync(dir), name: path.basename(dir)});
}
/**
 * 指定されたパターンにマッチする全てのファイル/フォルダを順次返すイテレータを返す。
 * @param pattern {string} 検索するファイル/フォルダ名のパターン。
 *
 * - `**`はそれ以下の全てのパス
 * - `?`はファイル/フォルダの名前に使用される全ての1文字
 * - `*`はファイル/フォルダの名前に使用される全ての0個以上の文字
 *
 * にマッチする。
 * @param basedir {string} 検索を開始するディレクトリへのパス。
 *
 * 省略時にはカレントディレクトリ。
 * @param filter {(item: IItem) => any} そのファイル、フォルダを無視するかどうかを決定する関数を指定する。
 *
 * 無視されたファイル・フォルダは`pattern`にマッチしてもイテレータには返されない。
 */
export function wildcard(
  pattern: string,
  basedir?: string,
  filter?: (item: IItem) => any
): IterableIterator<IItem>;
/**
 * 指定されたパターンにマッチする全てのファイル/フォルダを順次返すイテレータを返す。
 * @param pattern {string} 検索するファイル/フォルダ名のパターン。
 *
 * - `**`はそれ以下の全てのパス
 * - `?`はファイル/フォルダの名前に使用される全ての1文字
 * - `*`はファイル/フォルダの名前に使用される全ての0個以上の文字
 *
 * にマッチする。
 * @param filter {(item: IItem) => any} そのファイル、フォルダを無視するかどうかを決定する関数を指定する。
 *
 * 無視されたファイル・フォルダは`pattern`にマッチしてもイテレータには返されない。
 */
export function wildcard(
  pattern: string,
  filter: (item: IItem) => any
): IterableIterator<IItem>;
/**
 * 指定されたパターンにマッチする全てのファイル/フォルダを順次返すイテレータを返す。
 * @param pattern {string} 検索するファイル/フォルダ名のパターン。
 *
 * - `**`はそれ以下の全てのパス
 * - `?`はファイル/フォルダの名前に使用される全ての1文字
 * - `*`はファイル/フォルダの名前に使用される全ての0個以上の文字
 *
 * にマッチする。
 * @param options 検索に関するオプション
 * @param options.basedir {string} 検索を開始するディレクトリへのパス。
 *
 * 省略時にはカレントディレクトリ。
 * @param options.filter {Function} そのファイル、フォルダを無視するかどうかを決定する関数を指定する。
 *
 * 無視されたファイル・フォルダは`pattern`にマッチしてもイテレータには返されない。
 */
export function wildcard(
  pattern: string,
  // tslint:disable-next-line:unified-signatures
  options:
    | {basedir?: string; filter?: (item: IItem) => any}
    | ((item: IItem) => any)
): IterableIterator<IItem>;
export function* wildcard(
  pattern: string,
  options?:
    | {basedir?: string; filter?: (item: IItem) => any}
    | string
    | ((item: IItem) => any),
  filter?: (item: IItem) => any
) {
  const basedir =
    (options &&
      (typeof options === 'string'
        ? options
        : typeof options !== 'function' && options.basedir)) ||
    undefined;
  if (!filter && options) {
    filter =
      typeof options === 'function'
        ? options
        : typeof options === 'object'
        ? options.filter
        : undefined;
  }
  const fullpath = path.resolve(basedir || '.', pattern);
  const {root} = path.parse(fullpath);
  const pathes = fullpath
    .substr(root.length)
    .split(/\\+/)
    .map((pathAtom, index, array) => {
      // \で終わっているようなパターンはそのディレクトリ自体を返す
      if (pathAtom === '') {
        return function*(f: string) {
          const stat = fs.statSync(f);
          yield {path: f, name: path.basename(f), stat};
        };
      }
      const last = index + 1 === array.length;
      // **はすべてのフォルダ(途中にあった場合)、もしくはファイルとフォルダ(最後にあった場合)を返す
      if (pathAtom === '**') {
        return function*(ff: string) {
          for (const item of recursiveFolderAndFiles(ff, filter)) {
            if (!last && item.stat.isDirectory()) {
              continue;
            }
            yield item;
          }
        };
      }
      // ワイルドカードを含む場合はそのパターンにあったファイルかフォルダを返す
      if (/[*?{]/.test(pathAtom)) {
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
      // ワイルドカードを含まない場合はそのパスをつなげて存在していればそのファイル、もしくはフォルダを返す
      return function*(ff: string) {
        const lastpath = path.resolve(ff, pathAtom);
        // 存在していなければ返さない
        if (!fs.existsSync(lastpath)) {
          return;
        }
        const stat = fs.statSync(lastpath);
        // このパターンが途中にあって、見つかったのがファイルなら返さない
        if (!last && !stat.isDirectory()) {
          return;
        }
        yield {path: lastpath, name: path.basename(lastpath), stat};
      };
    });
  yield* (function* traverse(
    ff: string,
    index: number
  ): IterableIterator<IItem> {
    // 最後のパターンなら見つかったファイル、フォルダをすべて返す
    if (index + 1 === pathes.length) {
      yield* pathes[index](ff);
      return;
    }
    for (const item of pathes[index](ff)) {
      // パターンの途中なのでディレクトリ以外は無視
      if (!item.stat.isDirectory()) {
        continue;
      }
      // このディレクトリを基点にして検索
      yield* traverse(item.path, index + 1);
    }
  })(root, 0);
}

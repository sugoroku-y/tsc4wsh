/// <reference types="iterables" />

namespace Scripting.FileSystemObject.Utils {
  declare const fso: Scripting.FileSystemObject;

  type FolderItem = File | Folder;

  export function isFolder(f: FolderItem): f is Folder {
    return 'Files' in f;
  }
  export function isFile(f: FolderItem): f is File {
    return !isFolder(f);
  }
  function sort<T extends {Name: string}>(array: T[]): T[] {
    return array.sort((a, b) => {
      const aa = a.Name.toUpperCase();
      const bb = b.Name.toUpperCase();
      return aa === bb ? 0 : aa < bb ? -1 : 1;
    });
  }
  export function files(folder: Folder) {
    return sort([...Iterables.from(folder.Files)]);
  }
  export function subFolders(folder: Folder) {
    return sort([...Iterables.from(folder.SubFolders)]);
  }
  export function filesAndSubFolders(folder: Folder) {
    return sort([...Iterables.from(folder.Files), ...Iterables.from(folder.SubFolders)]);
  }
  export function getItem(path: string) {
    if (fso.FileExists(path)) {
      return fso.GetFile(path);
    }
    if (fso.FolderExists(path)) {
      return fso.GetFolder(path);
    }
    return undefined;
  }
  function error(message?: string): never {
    throw new Error(message);
  }
  export function splitPath(path: string): string[] {
    return [...path.matchAll(/^((?:[A-Z]:|\\{2}[^\\]+\\[^\\]+)?\\)\\*|([^\\]+\\)\\*|([^\\]+)$|[\s\S]/gi)].map(
      ({1: $1, 2: $2, 3: $3, index}) => $1 || $2 || $3 || error(`不正なパス: ${path}:${index}`),
    );
  }
  function absolutePath(path: string): string {
    return `${fso.GetAbsolutePathName(path)}${/\\$/.test(path) ? '\\' : ''}`;
  }

  export function relativePath(path: string, base?: string | undefined): string {
    const absolute = absolutePath(path);
    const pathSplitted = splitPath(absolute);
    const aa = absolutePath(`${base || '.'}\\`);
    const baseSplitted = splitPath(aa);
    const limit = Math.min(pathSplitted.length, baseSplitted.length);
    let matchedLength = 0;
    while (
      matchedLength < limit &&
      pathSplitted[matchedLength].toLowerCase() === baseSplitted[matchedLength].toLowerCase()
    ) {
      ++matchedLength;
    }
    if (!matchedLength) {
      return pathSplitted.join('');
    }
    if (matchedLength === pathSplitted.length && matchedLength === baseSplitted.length) {
      return '.';
    }
    return (
      (baseSplitted.length > matchedLength ? '..\\'.repeat(baseSplitted.length - matchedLength) : '') +
      pathSplitted.slice(matchedLength).join('')
    );
  }

  export function commonPath(...paths: string[]): string | undefined {
    if (!paths.length) {
      return '';
    }
    if (paths.length === 1) {
      return paths[0];
    }
    const common = paths
      .map(path => fso.GetAbsolutePathName(path))
      .map(path => splitPath(path))
      .reduce((result, path) => {
        const limit = Math.max(result.length, path.length);
        for (let i = 0; i < limit; ++i) {
          if (result[i] === path[i]) {
            continue;
          }
          if (i === result.length) {
            return result;
          }
          if (i === path.length) {
            return path;
          }
          return result.slice(0, i);
        }
        return result;
      });
    if (common.length === 0) {
      return undefined;
    }
    if (common.length === 1) {
      return common[0];
    }
    return common.reduce((built, path) => fso.BuildPath(built, path));
  }

  export function* recursiveFolders(folder: Scripting.Folder): IterableIterator<Scripting.Folder> {
    yield folder;
    for (const f of subFolders(folder)) {
      yield* recursiveFolders(f);
    }
  }
  export function* recursiveFiles(folder: Scripting.Folder): IterableIterator<Scripting.Folder | Scripting.File> {
    for (const f of recursiveFolders(folder)) {
      yield* files(f);
    }
  }
  export function* recursiveFolderAndFiles(
    folder: Scripting.Folder,
  ): IterableIterator<Scripting.Folder | Scripting.File> {
    for (const f of recursiveFolders(folder)) {
      yield f;
      yield* files(f);
    }
  }

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
  /**
   * 指定されたパターンにマッチする全てのファイル/フォルダを順次返すイテレータを返す。
   * @param pattern 検索するファイル/フォルダ名のパターン。`**`はそれ以下の全てのパス、`?`は名前に使用される全ての1文字、`*`は0以上の名前に使用される全ての文字にマッチする。
   * @param basedir 検索を開始するディレクトリへのパス。省略時にはカレントディレクトリ。
   */
  export function wildcard(pattern: string, basedir?: string) {
    basedir = fso.GetAbsolutePathName(basedir || '.');
    const fullpath = isAbsolute(pattern) ? pattern : fso.BuildPath(basedir, pattern);
    if (!/[*?{]/.test(fullpath)) {
      if (fso.FolderExists(fullpath)) {
        return Iterables.of(fso.GetFolder(fullpath));
      }
      if (fso.FileExists(fullpath)) {
        return Iterables.of(fso.GetFile(fullpath));
      }
      return Iterables.of<Scripting.File>();
    }
    const match = fullpath.match(/^(?:[A-Z]:|\\\\[^\\]+\\+[^\\]+)?(?:\\+[^*?{]+)*\\+/i);
    if (!match) {
      throw new Error('');
    }
    const root = match[0];
    if (!fso.FolderExists(root)) {
      throw new Error(`The folder not found: ${root}`);
    }
    const folder = fso.GetFolder(root);
    const pathes = fullpath
      .slice(root.length)
      .split(/\\+/)
      .map((pathAtom, index, array) => {
        if (pathAtom === '') {
          return function* (f: Scripting.Folder) {
            yield f;
          };
        }
        const last = index + 1 === array.length;
        if (pathAtom === '**') {
          return last ? recursiveFolderAndFiles : recursiveFolders;
        }
        if (/[*?{]/.test(pathAtom)) {
          const atomPattern = wildcardToRegExp(pathAtom);
          return function* (ff: Scripting.Folder) {
            for (const f of subFolders(ff)) {
              if (atomPattern && atomPattern.test(f.Name)) {
                yield f;
              }
            }
            if (last) {
              for (const f of files(ff)) {
                if (atomPattern && atomPattern.test(f.Name)) {
                  yield f;
                }
              }
            }
          };
        }
        return function* (ff: Scripting.Folder) {
          const lastpath = fso.BuildPath(ff.Path, pathAtom);
          if (fso.FolderExists(lastpath)) {
            yield fso.GetFolder(lastpath);
            return;
          }
          if (last) {
            if (fso.FileExists(lastpath)) {
              yield fso.GetFile(lastpath);
              return;
            }
          }
        };
      });
    return (function* traverse(ff: Scripting.Folder, index: number): Iterable<Scripting.Folder | Scripting.File> {
      if (index + 1 === pathes.length) {
        yield* pathes[index](ff);
        return;
      }
      for (const item of pathes[index](ff)) {
        if (!isFolder(item)) {
          continue;
        }
        yield* traverse(item, index + 1);
      }
    })(folder, 0);
  }

  export function ensureDirectory(dirpath: string) {
    if (!dirpath) {
      return fso.GetFolder('.');
    }
    if (fso.FolderExists(dirpath)) {
      return fso.GetFolder(dirpath);
    }
    if (fso.FileExists(dirpath)) {
      throw new Error(`ファイルが存在しています。: ${dirpath}`);
    }
    ensureDirectory(fso.GetParentFolderName(dirpath));
    return fso.CreateFolder(dirpath);
  }

  export function resolve(...paths: string[]) {
    let current = fso.GetAbsolutePathName('.');
    for (const path of paths) {
      if (isAbsolute(path)) {
        // 絶対パスの場合は置き換え
        current = path;
      } else {
        // 相対パスの場合は連結
        current = fso.BuildPath(current, path);
      }
    }
    return current;
  }

  export function isAbsolute(path: string) {
    return /^(?:[A-Z]:|\\\\[^\\\/"<>|*?:]+\\[^\\\/"<>|*?:]+)?\\/i.test(path);
  }
}

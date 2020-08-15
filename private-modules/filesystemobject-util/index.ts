/// <reference types="activex-scripting" />
/// <reference types="generator" />

namespace Scripting.FileSystemObject.Utils {
  declare const fso: Scripting.FileSystemObject;

  type FolderItem = File | Folder;
  const G = Generator;

  export function isFolder(f: FolderItem): f is Folder {
    return 'Files' in f;
  }
  export function isFile(f: FolderItem): f is File {
    return !isFolder(f);
  }
  function sort<T extends {Name: string}>(a: T[]): T[] {
    return a.sort((a, b) => {
      const aa = a.Name.toUpperCase();
      const bb = b.Name.toUpperCase();
      return aa === bb ? 0 : aa < bb ? -1 : 1;
    });
  }
  export function files(folder: Folder) {
    return sort([...G.from(folder.Files)]);
  }
  export function subFolders(folder: Folder) {
    return sort([...G.from(folder.SubFolders)]);
  }
  export function filesAndSubFolders(folder: Folder) {
    return sort([...G.concat(G.from(folder.Files), G.from(folder.SubFolders))]);
  }
  export function getItem(path: string) {
    if (fso.FileExists(path)) return fso.GetFile(path);
    if (fso.FolderExists(path)) return fso.GetFolder(path);
    return undefined;
  }
  export function splitPath(path: string): string[] {
    const splited: string[] = [];
    let match = /^(?:([A-Z]):|\\{2,}([^\\]+)\\+([^\\]+))?(\\+|$)?/i.exec(path);
    if (match) {
      if (match[1]) {
        if (!match[4]) throw new Error(`ドライブ指定時には絶対パスで指定してください`);
        splited.push(`${match[1]}:\\`);
      } else if (match[2]) {
        splited.push(`\\\\${match[2]}:\\${match[3]}\\`);
      } else if (match[4]) {
        splited.push('\\');
      }
      if (match[0]) path = path.substr(match[0].length);
    }
    if (!path) return splited;
    return splited.concat(path.split(/\\+/));
  }

  export function relativePath(path: string, base?: string | undefined): string {
    const absolute = fso.GetAbsolutePathName(path);
    const _path = splitPath(absolute);
    const aa = fso.GetAbsolutePathName(base || '.');
    const _base = splitPath(aa);
    const limit = Math.min(_path.length, _base.length);
    let matchedLength = 0;
    while (matchedLength < limit && _path[matchedLength].toLowerCase() === _base[matchedLength].toLowerCase()) {
      ++matchedLength;
    }
    if (!matchedLength) return absolute;
    if (matchedLength === _path.length && matchedLength == _base.length) return '.';
    return (_base.length > matchedLength ? '..\\'.repeat(_base.length - matchedLength) : '')
      + _path.slice(matchedLength).join('\\');
  }

  export function commonPath(...paths: string[]): string | undefined {
    if (!paths.length) return '';
    if (paths.length === 1) return paths[0];
    const common = paths.map(path => fso.GetAbsolutePathName(path))
      .map(path => splitPath(path))
      .reduce((common, path) => {
        const limit = Math.max(common.length, path.length);
        for (let i = 0; i < limit; ++i) {
          if (common[i] === path[i]) continue;
          if (i === common.length) return common;
          if (i === path.length) return path;
          return common.slice(0, i);
        }
        return common;
      });
    if (common.length === 0) return undefined;
    if (common.length === 1) return common[0];
    return common.reduce((built, path) => fso.BuildPath(built, path));
  }

  export function* recursiveFolders(folder: Scripting.Folder): IterableIterator<Scripting.Folder> {
    yield folder;
    for (const f of Generator.from(folder.SubFolders)) {
      yield* recursiveFolders(f);
    }
  }
  export function* recursiveFiles(folder: Scripting.Folder): IterableIterator<Scripting.Folder | Scripting.File> {
    for (const f of recursiveFolders(folder)) {
      yield* Generator.from(f.Files);
    }
  }
  export function* recursiveFolderAndFiles(folder: Scripting.Folder): IterableIterator<Scripting.Folder | Scripting.File> {
    for (const f of recursiveFolders(folder)) {
      yield f;
      yield* Generator.from(f.Files);
    }
  }

  export function wildcardToRegExp(pattern: string): RegExp | undefined {
    if (!pattern) return undefined;
    if (pattern.includes('\\')) throw new Error(`Unsupported wildcard: ${pattern}`);
    let depth = 0;
    const regex = '^' + pattern.replace(/[\^$()\[\]{}+.*?,]/g, ch => {
      switch (ch) {
      case '*':
        return '.*';
      case '?':
        return '.';
      case '{':
        ++depth;
        return '(?:';
      case '}':
        if (depth <= 0) throw new Error('Unmatched `}`');
        --depth;
        return ')';
      case ',':
        return depth > 0 ? '|' : ',';
      default:
        return '\\' + ch;
      }
    }) + '$';
    if (depth > 0) throw new Error('Unmatched `{`');
    return new RegExp(regex, 'i');;
  }
  /**
   * 指定されたパターンにマッチする全てのファイル/フォルダを順次返すイテレータを返す。
   * @param pattern 検索するファイル/フォルダ名のパターン。`**`はそれ以下の全てのパス、`?`は名前に使用される全ての1文字、`*`は0以上の名前に使用される全ての文字にマッチする。
   * @param basedir 検索を開始するディレクトリへのパス。省略時にはカレントディレクトリ。
   */
  export function wildcard(pattern: string, basedir?: string) {
    basedir = fso.GetAbsolutePathName(basedir || '.');
    const fullpath = /^(?:[A-Z]:|\\\\[^\\\\]+\\[^\\\\]+)?\\/i.test(pattern) ? pattern : fso.BuildPath(basedir, pattern);
    if (!/[*?{]/.test(fullpath)) {
      if (fso.FolderExists(fullpath)) {
        return Generator.of(fso.GetFolder(fullpath));
      }
      if (fso.FileExists(fullpath)) {
        return Generator.of(fso.GetFile(fullpath));
      }
      return Generator.of<Scripting.File>();
    }
    const match = fullpath.match(/^(?:[A-Z]:|\\\\[^\\]+\\+[^\\]+)?(?:\\+[^*?{]+)*\\+/i);
    if (!match || match.index !== 0) throw new Error('');
    if (match.index >= fullpath.length) throw new Error('');
    const root = match[0];
    if (!fso.FolderExists(root)) throw new Error(`The folder not found: ${root}`);
    const folder = fso.GetFolder(root);
    const pathes = fullpath.substr(root.length).split(/\\+/).map((path, index, array) => {
      if (path === '') return function*(f: Scripting.Folder) {yield f;};
      const last = index + 1 === array.length;
      if (path === '**') return last ? recursiveFolderAndFiles : recursiveFolders;
      if (/[*?{]/.test(path)) {
        const pattern = wildcardToRegExp(path);
        return function*(ff: Scripting.Folder) {
          for (const f of Generator.from(ff.SubFolders)) {
            if (pattern && pattern.test(f.Name)) yield f;
          }
          if (last) {
            for (const f of Generator.from(ff.Files)) {
              if (pattern && pattern.test(f.Name)) yield f;
            }
          }
        };
      }
      return function*(ff: Scripting.Folder) {
        const lastpath = fso.BuildPath(ff.Path, path);
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
    return function* traverse(ff: Scripting.Folder, index: number): IterableIterator<Scripting.Folder | Scripting.File> {
      if (index + 1 === pathes.length) {
        yield* pathes[index](ff);
        return;
      }
      for (const item of pathes[index](ff)) {
        if (!isFolder(item)) continue;
        yield* traverse(item, index + 1);
      }
    }(folder, 0);
  }

  export function ensureDirectory(dirpath: string) {
    if (!dirpath) return fso.GetFolder('.');
    if (fso.FolderExists(dirpath)) return fso.GetFolder(dirpath);
    if (fso.FileExists(dirpath)) throw new Error(`ファイルが存在しています。: ${dirpath}`);
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

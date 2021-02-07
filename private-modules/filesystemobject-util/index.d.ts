/// <reference types="activex-scripting" />
declare namespace Scripting.FileSystemObject.Utils {
    type FolderItem = File | Folder;
    export function isFolder(f: FolderItem): f is Folder;
    export function isFile(f: FolderItem): f is File;
    export function files(folder: Folder): File[];
    export function subFolders(folder: Folder): Folder[];
    export function filesAndSubFolders(folder: Folder): FolderItem[];
    export function getItem(path: string): FolderItem;
    export function splitPath(path: string): string[];
    export function relativePath(path: string, base?: string | undefined): string;
    export function commonPath(...paths: string[]): string | undefined;
    export function recursiveFolders(folder: Scripting.Folder): IterableIterator<Scripting.Folder>;
    export function recursiveFiles(folder: Scripting.Folder): IterableIterator<Scripting.Folder | Scripting.File>;
    export function recursiveFolderAndFiles(folder: Scripting.Folder): IterableIterator<Scripting.Folder | Scripting.File>;
    export function wildcardToRegExp(pattern: string): RegExp | undefined;
    /**
     * 指定されたパターンにマッチする全てのファイル/フォルダを順次返すイテレータを返す。
     * @param pattern 検索するファイル/フォルダ名のパターン。`**`はそれ以下の全てのパス、`?`は名前に使用される全ての1文字、`*`は0以上の名前に使用される全ての文字にマッチする。
     * @param basedir 検索を開始するディレクトリへのパス。省略時にはカレントディレクトリ。
     */
    export function wildcard(pattern: string, basedir?: string): Iterable<FolderItem>;
    export function ensureDirectory(dirpath: string): Folder;
    export function resolve(...paths: string[]): string;
    export function isAbsolute(path: string): boolean;
    export {};
}

import * as fs from 'fs';
import * as path from 'path';

export function assert(o: unknown, message?: string): asserts o {
  if (!o) {
    throw new Error(message);
  }
}

export function getErrorCode(ex: unknown): string | undefined {
  // istanbul ignore next
  return typeof ex === 'object' && ex && 'code' in ex && typeof ex.code === 'string' ? ex.code : undefined;
}

export async function isDirectory(path: string): Promise<boolean> {
  try {
    return (await fs.promises.stat(path)).isDirectory();
  } catch (ex) {
    // istanbul ignore next ENOENT以外のエラーをテスト環境で起こすのは難しいので除外
    if (getErrorCode(ex) !== 'ENOENT') {
      throw ex;
    }
    // 存在していなければディレクトリではない
    return false;
  }
}

export async function isFile(path: string) {
  try {
    return (await fs.promises.stat(path)).isFile();
  } catch (ex) {
    // istanbul ignore next
    if (getErrorCode(ex) !== 'ENOENT') {
      throw ex;
    }
    // 存在していなければファイルではない
    return false;
  }
}

export async function mkdirEnsure(dirPath: string) {
  for (; ;) {
    try {
      await fs.promises.mkdir(dirPath);
      return;
    } catch (ex) {
      switch (getErrorCode(ex)) {
        case 'EEXIST':
          // 既に存在していたらディレクトリかどうかを確認
          if ((await fs.promises.stat(dirPath)).isDirectory()) {
            // ディレクトリなら問題ない
            return;
          }
          break;
        case 'ENOENT':
          // 親ディレクトリが存在していなければ作成してリトライ
          await mkdirEnsure(path.dirname(dirPath));
          continue;
      }
      // それ以外のエラーはエラーとして扱う
      throw ex;
    }
  }
}

export async function rmdirEnsure(dirPath: string) {
  const list = await fs.promises
    .readdir(dirPath, {withFileTypes: true})
    .catch(
      // istanbul ignore next 存在していなかったらエラーにしない
      (ex: unknown) => getErrorCode(ex) === 'ENOENT' ? undefined : Promise.reject(ex)
    );
  if (!list) {
    // ディレクトリが存在しなければ何もしない
    return;
  }
  // ここに来る時点でディレクトリは存在しているはずなのでここ以降ではエラー確認しない
  for (const entry of list) {
    const fullpath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      await rmdirEnsure(fullpath);
    } else {
      await fs.promises.unlink(fullpath);
    }
  }
  await fs.promises.rmdir(dirPath);
}

export async function unlinkEnsure(path: string) {
  try {
    await fs.promises.unlink(path);
  } catch (ex) {
    // istanbul ignore next ENOENT以外のエラーはテスト環境で起こすのは難しいので除外
    if (getErrorCode(ex) !== 'ENOENT') {
      throw ex;
    }
    // 存在しなければ何もしない
  }
}

export function indented(...args: [TemplateStringsArray, ...unknown[]]): string {
  const [template] = args;
  const [indent] = /\n[ \t]+$/.exec(template[template.length - 1]) ?? error`indent not found`;
  return template
    // インデントを除去
    .map((e, i, a) => {
      e = e.replaceAll(indent, '\n');
      if (i === 0) {
        // 先頭の改行を除去
        assert(e.charAt(0) === '\n', 'first line feed not found');
        e = e.slice(1);
      }
      // iは0で且つa.length - 1である可能性があるので
      // 上下二つのif文は決してelseでつないではいけない
      if (i === a.length - 1) {
        // 末尾の改行も除去
        assert(e.charAt(e.length - 1) === '\n', 'last line feed not found');
        e = e.slice(0, -1);
      }
      return e;
    })
    .reduce((r, e, i) => `${r}${args[i]}${e}`);
}

export function error(...args: [TemplateStringsArray, ...unknown[]]): never {
  throw new Error(args[0].reduce((r, e, i) => `${r}${args[i]}${e}`));
}

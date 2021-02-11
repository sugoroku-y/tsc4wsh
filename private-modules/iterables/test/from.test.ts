/// <reference types="iterables" />
/// <reference path="./test.ts" />

namespace Iterables_from_test {
  const I = Iterables;
  declare const fso: Scripting.FileSystemObject;

  test('from(fso.GetFolder("temp").SubFolders)', () => {
    const temp = fso.BuildPath(
      fso.GetParentFolderName(WScript.ScriptFullName),
      'temp'
    );
    // すでに存在していたらまるごと削除
    if (fso.FileExists(temp)) {
      fso.DeleteFile(temp);
    } else if (fso.FolderExists(temp)) {
      fso.DeleteFolder(temp, true);
    }
    // テスト用のフォルダを作成してその中に2つフォルダを作成
    fso.CreateFolder(temp);
    try {
      const folder = fso.GetFolder(temp);
      const path1 = fso.BuildPath(folder.Path, 'folder1');
      fso.CreateFolder(path1);
      try {
        const subfolder1 = fso.GetFolder(path1);
        const path2 = fso.BuildPath(folder.Path, 'folder2');
        fso.CreateFolder(path2);
        try {
          const subfolder2 = fso.GetFolder(path2);
          // 作成したフォルダの一覧がGetFolderしたもの2つと一致するか
          expect(I.from(folder.SubFolders)).toBe(I.of(subfolder1, subfolder2));
        } finally {
          fso.DeleteFolder(path2);
        }
      } finally {
        fso.DeleteFolder(path1);
      }
    } finally {
      fso.DeleteFolder(temp);
    }
  });
  test('from([1,2,3])', () => {
    expect(I.from([1, 2, 3])).toBe(I.of(1, 2, 3));
  });
}

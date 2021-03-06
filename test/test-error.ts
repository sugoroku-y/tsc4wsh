/// <reference types="wscript-util" />
/// <reference types="filesystemobject-util" />

WshRuntime`
<description>
  tsc4wshのデバッグ用スクリプト
</description>
<named name="?" type="simple" required="false" helpstring="使い方(これ)を表示します。 />
<named name="base" type="string" required="true" helpstring="相対パスやワイルドカードの基準となるディレクトリ" />
<unnamed name="filename" many="true" required="true" helpstring="処理するファイル。ワイルドカード指定可。"/>
<example>
例:
  test.wsf /?
    使い方(これ)を表示します。
  test.wsf /base:\\dokokano\nantoka\Matser\Release\Updater **\*.tbl
    \\dokokano\nantoka\Matser\Release\Updater以下にある拡張子がtblのファイルすべてを処理します。
</example>
`;

namespace testError {
  const fsoU = Scripting.FileSystemObject.Utils;
  declare const fso: Scripting.FileSystemObject;

  const output: {
    WriteLine: (s: string) => void;
  } = WScriptUtil.Arguments.Named(['Output', 'Out', 'O'], outputPath => {
    if (outputPath) {
      return fso.OpenTextFile(
        outputPath,
        Scripting.IOMode.ForWriting,
        true,
        Scripting.Tristate.TristateFalse
      );
    }
    return WScript.StdOut;
  });
  for (const arg of WScriptUtil.Arguments.Unnamed()) {
    for (const item of fsoU.wildcard(arg)) {
      const d = new Date(item.DateLastModified);
      output.WriteLine(
        `${fsoU.relativePath(item.Path)} ${item.Size} ${d.toLocaleString()}`
      );
    }
  }
}

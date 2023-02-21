/// <reference types="wscript-util" />
/// <reference types="filesystemobject-util" />

WshRuntime`
<description>
  tsc4wshのデバッグ用スクリプト
</description>
<named name="?" type="simple" required="false" helpstring="使い方(これ)を表示します。" />
<named name="base" type="string" required="true" helpstring="相対パスやワイルドカードの基準となるディレクトリ" />
<unnamed name="filename" many="true" required="true" helpstring="処理するファイル。ワイルドカード指定可。"/>
<example>
例:
  test.wsf /?
    使い方(これ)を表示します。
  test.wsf /base:\\dokokano\nantoka\Master\Release\Updater **\*.tbl
    \\dokokano\nantoka\Master\Release\Updater以下にある拡張子がtblのファイルすべてを処理します。
</example>
`;

VBScript`
Function vbsInputBox(msg, title)
  vbsInputBox = InputBox(msg, title)
End Function
`;
declare function vbsInputBox(msg: string, title: string): string;

WScript.Echo(vbsInputBox('何か入力して下さい。', 'InputBoxのテスト'));

/**
 * @onend
 */
function onendfunc1() {
  WScript.Echo('test1 on end');
}
// @onend
function onendfunc2() {
  WScript.Echo('test2 on end');
}

namespace test1 {
  const fsoU = Scripting.FileSystemObject.Utils;
  declare const fso2: Scripting.FileSystemObject;

  const output: {
    WriteLine: (s: string) => void;
  } = WScriptUtil.Arguments.Named(['Output', 'Out', 'O'], outputPath => {
    if (outputPath) {
      return fso2.OpenTextFile(
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
  WScript.Echo(`あいうえお天地玄黄${String(Symbol.for('iterator'))}abc ]]>`);
  // ]]>
  WScriptUtil.validateParameters();
  const test = {
    default: 'aaa',
    for: 'bbb',
    delete: 'ccc',
  };
  WScript.Echo(`${test.default}, ${test.for}, ${test.delete}`);
}

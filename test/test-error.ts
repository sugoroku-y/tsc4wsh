/// <reference types="wscript-util" />
/// <reference types="filesystemobject-util" />
/// <reference types="windows-installer" />

/(?<!v)(?<test>abc)/s;

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
  test.wsf /base:\\dokokano\nantoka\Master\Release\Updater **\*.tbl
    \\dokokano\nantoka\Master\Release\Updater以下にある拡張子がtblのファイルすべてを処理します。
</example>
`;
VBScript``;


namespace testError {
  const fsoU = Scripting.FileSystemObject.Utils;
  declare const fso: WindowsInstaller.Installer;
  declare const fso2: Scripting.FileSystemObject;
  // @ts-expect-error
  declare const noType;
  declare const unknownConst: unknown;
  declare const {Client}: WindowsInstaller.Installer;
  if (noType && typeof unknownConst === 'string' && typeof Client == 'number') {
    WScript.Echo(`${noType} ${unknownConst} ${Client}`);
  }

  const output: {
    WriteLine: (s: string) => void;
  } = WScriptUtil.Arguments.Named(['Output', 'Out', 'O'], outputPath => {
    if (outputPath) {
      fso.OpenDatabase(outputPath, WindowsInstaller.msiOpenDatabaseMode.msiOpenDatabaseModeReadOnly);
      return fso2.OpenTextFile(outputPath);
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

function tagged(tag: string): (...args: [TemplateStringsArray, ...unknown[]]) => string {
  return (...args) => {
    return tag + args[0].reduce((r, e, i) => `${r}${args[i]}${e}`);
  };
}

tagged('test')`あいうえお${WScript.ScriptFullName}abcde`;
basic`あいうえお${WScript.ScriptFullName}abcde`;

function basic(...args: [TemplateStringsArray, ...unknown[]]): string {
  return args[0].reduce((r, e, i) => `${r}${args[i]}${e}`);
}

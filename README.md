# tsc4wsh

これはWindows Scripting Host向けTypeScriptコンパイラです。

This is a TypeScript compiler for Windows Scripting Host.

## 使い方

### インストール

以下のコマンドを実行してください

> npm i tsc4wsh -D

### 準備

以下のコマンドを実行してください。

> npx tsc4wsh --init

実行したときのカレントディレクトリに`tsconfig.json`が出力されます。

### コンパイル

何かTypeScriptで記述したスクリプトを用意してください。

```ts
/// <reference types="wscript-util" />
/// <reference types="filesystemobject-util" />

const fsoU = Scripting.FileSystemObject.Utils;

for (const arg of WScriptUtil.Arguments.Unnamed()) {
  for (const item of fsoU.wildcard(arg)) {
    const d = new Date(item.DateLastModified);
    WScript.Echo(`${arg} ${item.Size} ${d.toLocaleString()}`);
  }
}
```

`main.ts`というファイルを用意したとして`example.wsf`という名前のスクリプトに変換する場合には以下のコマンドを実行します。

> npx tsc4wsh main.ts -o example.wsf

### ライブラリ

`private-modules`以下にWSHスクリプトで使われそうなライブラリを用意しています。

自分でスクリプトを書くために必要な部分だけを宣言、定義しているため、不十分なところがままありますが、必要なときは修正してください。


# tsc4wsh

これはWindows Scripting Host向けTypeScriptコンパイラです。

This is a TypeScript compiler for Windows Scripting Host.

[![NPM version](https://img.shields.io/npm/v/tsc4wsh.svg?style=flat)](https://www.npmjs.com/package/tsc4wsh)
[![NPM monthly download](https://img.shields.io/npm/dm/tsc4wsh.svg?style=flat)](https://www.npmjs.com/package/tsc4wsh)
[![NPM total download](https://img.shields.io/npm/dt/tsc4wsh.svg?style=flat)](https://www.npmjs.com/package/tsc4wsh)
[![Build Status](https://travis-ci.org/sugoroku-y/tsc4wsh.svg?branch=develop)](https://travis-ci.org/sugoroku-y/tsc4wsh)
[![MIT](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

## 使い方

### インストール

以下のコマンドを実行してください。

> npm install tsc4wsh -D

### コンパイル

何かTypeScriptで記述したスクリプトを用意してください。

```ts
declare const fso: Scripting.FileSystemObject;

for (const e = new Enumerator(WScript.Arguments.Unnamed); !e.atEnd(); e.moveNext()) {
  const arg = e.item();
  const file = fso.GetFile(arg);
  const d = new Date(file.DateLastModified);
  WScript.Echo(`${file.Path} ${file.Size} ${d.toLocaleString()}`);
}
```

`main.ts`というファイルを用意したとして`example.wsf`という名前のスクリプトに変換する場合には以下のコマンドを実行します。

> npx tsc4wsh main.ts -o example.wsf

### ライブラリ

`private-modules`以下にWSHスクリプトで使われそうなライブラリを用意しています。

自分でスクリプトを書くために必要な部分だけを宣言、定義しているため、不十分なところがままありますが、必要なときは修正してください。

### エディター向け設定ファイル

VS Codeなどのエディターにはコンパイルエラーを指摘してくれる機能がありますが、適切なtsconfig.jsonファイルを用意していないと`private-modules`以下のライブラリを参照している場合、エラーになってしまいます。

そこでtsconfig.jsonを出力するオプションを用意しています。以下のコマンドを実行してください。

> npx tsc4wsh --init

すると以下のようなtsconfig.jsonが出力されます。

```json
{
  "compilerOptions": {
    "target": "es3",
    "module": "none",
    "outFile": "./dummy.js",
    "downlevelIteration": true,
    "strict": true,
    "strictNullChecks": true,
    "types": [
      "windows-script-host",
      "activex-scripting",
      "activex-adodb"
    ],
    "lib": [
      "ESNext"

    ],
    "typeRoots": [
      "node_modules/tsc4wsh/private-modules",
      "node_modules/tsc4wsh/private-modules/@types"
    ]
  }
}
```

`typeRoots`に`private-modules`のパスが指定されますので、エディター上でもコンパイルが通るようになります。

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

## tsc4wshがやること

tsc4wshで行っていることは以下のとおりです。

- `private-modules`以下を`typeRoots`に追加
- TypeScriptのトランスパイル
- WSF形式での出力
- polyfillの追加
- `WshRuntime`テンプレートリテラル対応
- `VBScript`テンプレートリテラル対応
- `declare const`で宣言された変数
- 配列リテラルの最後のカンマ
- `default`、`for`などの予約語の名前のプロパティアクセス
- JScriptで未サポートな正規表現のチェック
- テンプレートリテラル内の非ASCII文字のエスケープ
- `@onend`が付けられた関数

### `private-modules`以下を`typeRoots`に追加

`private-modules`以下にWSHスクリプトで使われそうなライブラリや型定義を用意しています。

自分でスクリプトを書くために必要な部分だけを宣言、定義しているため、不十分なところがままありますが、必要なときは修正してください。そしてPull Requestをお願いします。

### TypeScriptのトランスパイル

当然のことながらTypeScriptをトランスパイルしています。ES3で出力しています。

### WSF形式での出力

JSファイルで出力しているとソース内で使用している文字コードがSHIFT-JISと見なされてしまいます。

UTF-8で扱ってもらった方がトランスパイル後の出力的にも楽なのでWSF形式で出力し、XMLの文字コード指定でUTF-8を指定しています。

### polyfillの追加

そのままではJScriptでサポートされていないメソッドの呼び出しなどでエラーになってしまいますので、使用しているメソッドを優先的にたりないものを追加したり、ES2015以降の仕様と異なっているものを差し替えています。

Symbolも若干無理やり気味ですがサポートしているので、generatorやfor-ofなども使えます。

### `WshRuntime`テンプレートリテラル対応

タグ付きテンプレートリテラルとして`WshRuntime`を用意しています。

このタグ付きテンプレート内に記述した内容はWSFの`runtime`要素内に記述されます。

`runtime`要素にはスクリプトのコマンドラインパラメーターの説明などを記述できます。

### `VBScript`テンプレートリテラル対応

JScriptではどうしてもできないことがVBScriptならできる、ということがたまにあります。

そのときにはタグ付きテンプレートリテラルとして`VBScript`を用意していますので、このタグ付きテンプレートリテラル内にVBScriptを記述してください。

### `declare const`で宣言された変数

`Scripting.FileSystemObject`のようなprogidを指定して

### 配列リテラルの最後のカンマ

### `default`、`for`などの予約語の名前のプロパティアクセス

### JScriptで未サポートな正規表現のチェック

### テンプレートリテラル内の非ASCII文字のエスケープ

### `@onend`が付けられた関数



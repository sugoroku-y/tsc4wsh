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

### ライブラリ・型定義ファイル

`private-modules`以下に私がスクリプト作成に利用している、ライブラリ・型定義を置いています。

ライブラリ

- debug-context
- filesystemobject-util
- iterables
- registry
- wscript-util
- wshtest
- xmlwriter

型定義

- dom3
- useragent
- windows-installer
- wsh
- xmlstream
- virtualbox(未完成)

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

```ts
declare const fso: Scripting.FileSystemObject;
```

のような記述があると、出力するWSFファイルに

```xml
<object id="fso" progid="Scripting.FileSystemObject"/>
```

という行が追加されます。つまりグローバルな定数として`fso`という`progid`が`Scripting.FileSystemObject`なオブジェクトが追加されます。

このとき指定する型は`ActiveXObjectNameMap`という`interface`に指定されたプロパティであることに注意してください。

`Scripting.FileSystemObject`は型名と`progid`が一致していますが、progidが`WScript.Shell`である型は`IWshRuntimeLibrary.WshShell`です。

`progid`に対応する型がわからない場合は

```ts
declare const wshShell: ActiveXObjectNameMap['WScript.Shell'];
```

のように一度書いてみて、`wshShell`にマウスカーソルを合わせて型情報が見るという手も使えます。

### 配列リテラルの最後のカンマ

ES5以降のJavaScriptでは配列リテラルの最後に`,`があっても無視されますが、
JScriptでは配列リテラルの最後に`,`があると配列の要素に`undefined`が追加されてしまいます。

```ts
const arr = [
  1,
  2,
  3,
];
// -> transpileすると
// var arr = [
//   1,
//   2,
//   3,
// ];
// と変換されるが、これは
// var arr = [1, 2, 3, undefined];
// と同じになる
```

そこでJScriptへの変換時に最後のカンマを出力しないようにしました。

```ts
const arr = [
  1,
  2,
  3,
];
// -> transpileすると
// var arr = [
//   1,
//   2,
//   3
// ];
// と変換される。

### `default`、`for`などの予約語の名前のプロパティアクセス

ES5以降では`Symbol.for`などプロパティ名であれば予約語も使えるようになりましたが、JScriptではプロパティ名でも予約語を使うとエラーになります。

そこで`Symbol.for`のようなプロパティアクセスは`Symbol['for']`のようにインデックスでのアクセスに置き換えます。

### JScriptで未サポートな正規表現のチェック

JScriptでは後読みや名前付きキャプチャをサポートしていません。

また`g`、`i`、`m`以外のフラグも未サポートです。

そこでこれらを使用していたらエラーになるようにしています。

### テンプレートリテラル内の非ASCII文字のエスケープ

テンプレートリテラル内に日本語文字のような非ASCII文字を記述していると、トランスパイル後には'\u3042\u3044\u3046'のようにエスケープされた状態になっています。

これはTypeScriptの標準的な動作なのですが、生成されたスクリプトが読みづらくなるのでエスケープしないように修正しています。

### `@onend`が付けられた関数

以下のようにトップレベルに記述した関数のコメントに`@onend`をつけると、プログラムの最後で自動的に呼び出されるようにしています。

```ts
// @onend
function onendfunction() {
  // ...
}
```

複数のソースファイルで設定を行って、最後にまとめて実行、のようなことをしたいとき、具体的にはそれぞれのソースでテストケースを記述しておいて最後にまとめてテストケースを実行、のようなことがしたいときに便利です。

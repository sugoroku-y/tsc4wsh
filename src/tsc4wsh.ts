/* globals Node Document Element */
import * as fs from 'fs';
import * as path from 'path';
import {DOMImplementation, XMLSerializer} from '@xmldom/xmldom';
import {transpile} from './transpile';
import {
  AssertionError,
  indented,
  isDirectory,
  isErrorCodeTo,
  mkdirEnsure,
} from './utils';

/**
 * job要素にobject要素を追加する
 * @param jobElement object要素を追加するjob要素
 * @param progids object要素のid属性やprogid属性を取得するマップ。
 */
function appendObjectElements(
  jobElement: Element,
  progids: {[id: string]: string}
) {
  const doc = jobElement.ownerDocument!;
  // ソース中にdeclare const fso: Scripting.FileSystemObjectのような記述を見つけたら
  // <object id="fso" progid="Scripting.FileSystemObject">を追加する
  for (const id in progids) {
    /* istanbul ignore next */ // eslint-disable-next-line no-prototype-builtins
    if (!progids.hasOwnProperty(id)) {
      continue;
    }
    const progid = progids[id];
    const objectElement = doc.createElement('object');
    objectElement.setAttribute('id', id);
    objectElement.setAttribute('progid', progid);
    jobElement.appendChild(objectElement);
    jobElement.appendChild(doc.createTextNode('\n'));
  }
}

/**
 * job要素にruntime要素を追加する。
 *
 * @param jobElement script要素を追加するjob要素
 * @param runtimes runtime要素の中身
 */
function appendRuntimeElement(jobElement: Element, runtimeDocs: Document[]) {
  const doc = jobElement.ownerDocument!;
  // WshRuntimeテンプレートリテラルがあったらruntime要素を追加
  if (!runtimeDocs.length) {
    return;
  }
  const runtimeElement = doc.createElement('runtime');
  jobElement.appendChild(runtimeElement);
  jobElement.appendChild(doc.createTextNode('\n'));
  // WshRuntimeテンプレートリテラルの中身をruntime要素に追加
  for (const runtimeDoc of runtimeDocs) {
    const element = runtimeDoc.documentElement;
    for (let child = element.firstChild; child; child = child.nextSibling) {
      runtimeElement.appendChild(doc.importNode(child, true));
    }
  }
}

/**
 * job要素にVBScript用script要素を追加する。
 *
 * @param jobElement script要素を追加するjob要素
 * @param vbscripts script要素の中身にするVBScript
 */
function appendVBScriptElements(jobElement: Element, vbscripts: string[]) {
  const doc = jobElement.ownerDocument!;
  // VBScript用script要素を追加
  for (const content of vbscripts) {
    const scriptElement = doc.createElement('script');
    scriptElement.setAttribute('language', 'VBScript');
    scriptElement.appendChild(
      doc.createCDATASection(content.replaceAll('\r\n', '\n'))
    );
    jobElement.appendChild(scriptElement);
    jobElement.appendChild(doc.createTextNode('\n'));
  }
}

/**
 * job要素にscript要素を追加する。
 *
 * @param jobElement script要素を追加するjob要素
 * @param script script要素の中身にするスクリプト
 */
function appendScriptElement(jobElement: Element, script: string) {
  const doc = jobElement.ownerDocument!;
  const content = script
    .replace(/^\ufeff/, '') // remove BOM
    .replaceAll('\r\n', '\n') // CRLF -> LF
    .replace(/^(?!\n)/, '\n') // insert LF to BOS
    .replace(/(?<!\n)$/, '\n'); // append LF to EOS
  // scriptはCDATAセクションで追加する
  const scriptElement = doc.createElement('script');
  scriptElement.setAttribute('language', 'JScript');
  scriptElement.appendChild(
    doc.createCDATASection(content.replaceAll('\r\n', '\n'))
  );
  jobElement.appendChild(scriptElement);
  jobElement.appendChild(doc.createTextNode('\n'));
  return scriptElement;
}

const dom = new DOMImplementation();
const serializer = new XMLSerializer();
// ポリフィルを追加(TypeScriptで記述してコンパイルしたもの)
const polyfill = fs.promises.readFile(
  path.join(__dirname, '../polyfill/index.js'),
  'utf-8'
);

async function makeWsfDom(
  transpiled: string,
  progids: {[id: string]: string},
  runtimes: Document[],
  vbscripts: string[]
) {
  const script = indented`
    'use strict';
    this.__extends = function __extends(a, b) {
        if (a && b) {
          a.prototype = Object.create(b.prototype);
          a.prototype.constructor = a;
        }
    };
    function Symbol(description) {
      return Symbol.implement(description);
    }
    ${await polyfill}
    ${transpiled}
    `;
  // WSFファイルの生成
  const doc = dom.createDocument(null, 'job', null);
  const jobElement = doc.documentElement!;
  jobElement.appendChild(doc.createTextNode('\n'));
  // object要素の追加
  appendObjectElements(jobElement, progids);
  // runtime要素の追加(必要なら)
  appendRuntimeElement(jobElement, runtimes);
  // VBScript用script要素の追加(必要なら)
  appendVBScriptElements(jobElement, vbscripts);
  // script要素の追加
  appendScriptElement(jobElement, script);
  return doc;
}

/**
 * WSFをファイルに出力
 * @param filepath ソースファイルのパス
 * @param doc WSFのドキュメント
 */
async function writeWsf(
  filepath: string,
  doc: Document,
  options: {console?: boolean; output?: string}
) {
  const content = indented`
    <?xml version="1.0" encoding="utf-8" ?>
    ${serializer.serializeToString(doc)}
    `;
  // コンソールモードの場合は標準出力に表示して終了
  /* istanbul ignore next */
  if (options.console) {
    process.stdout.write(`${filepath}:\n`);
    process.stdout.write(content);
    process.stdout.write('\n');
    return;
  }
  // istanbul ignore next
  const outputPath =
    // outputの指定が無ければソースファイルの拡張子をWSFに変えたものに出力
    !options.output
      ? filepath.replace(/\.ts$/, '.wsf')
      : // outputがディレクトリならばそこにファイル名をソースファイルの拡張子をWSFに変えたものに出力
      (await isDirectory(options.output))
      ? path.join(options.output, path.basename(filepath, '.ts') + '.wsf')
      : // それ以外はそのままの名前で出力
        options.output;
  const existent = await fs.promises.readFile(outputPath, 'utf8').catch(
    // istanbul ignore next 存在してなかった場合には空のファイルと同じ扱い
    ex => (isErrorCodeTo(ex, 'ENOENT') ? '' : Promise.reject(ex))
  );
  if (existent === content) {
    // 既存のファイルと内容が同じならタイムスタンプが変わらないように出力しない
    process.stdout.write(`\t\t変化なし: ${outputPath}\n`);
  } else {
    await mkdirEnsure(path.dirname(outputPath));
    await fs.promises.writeFile(outputPath, content, 'utf8');
    process.stdout.write(`\t\t出力先: ${outputPath}\n`);
  }
}

// istanbul ignore next
function getExceptionMessage(ex: unknown): string {
  return String(
    typeof ex === 'object' && ex && 'message' in ex ? ex.message : ex
  );
}

/**
 * tsc4wshを実行する
 * @param filepaths ワイルドカード展開済みのファイルリスト
 * @param dependencies ソースファイルの依存関係を格納するインスタンス
 * @param watchMode 監視モードかどうか
 */
export async function tsc4wsh(
  filepaths: string[],
  options: {console?: boolean; output?: string; watch?: boolean}
) {
  process.stdout.write(
    `${new Date().toLocaleTimeString()} - tsc4wsh 開始 ${
      /* istanbul ignore next */
      options.watch ? ' (監視中)' : ''
    }...\n`
  );

  try {
    // 指定されたファイルをコンパイル
    process.stdout.write(`  ${filepaths.join(', ')}\n`);
    try {
      // TSファイル以外は対象外
      /* istanbul ignore next */
      if (
        filepaths.some(
          filepath => path.extname(filepath).toLowerCase() !== '.ts'
        )
      ) {
        throw new Error('サポートしていないファイルです。');
      }
      const {script, objectMap, runtimes, vbscripts} = transpile(filepaths);
      const doc = await makeWsfDom(script, objectMap, runtimes, vbscripts);
      await writeWsf(filepaths[0], doc, options);
      return true;
    } catch (ex) {
      // istanbul ignore next ここが真にはならないように実装しないといけない
      if (ex instanceof AssertionError) {
        process.stderr.write(indented`
          Assertion Failure: ${ex.message}
          ${ex.stack}
          `);
        return false;
      }
      // エラーメッセージはすべて例外として受け取る
      const message = getExceptionMessage(ex)
        // LF/CRLFで始まっていなければLFを先頭に挿入
        .replace(/^(?!\r?\n)/, '\n')
        // LF/CRLFで終わっていなければLFを最後に追加
        .replace(/[^\r\n](?!\r?\n)$/, '$&\n')
        // 各行の行頭にインデントを二つ挿入
        .replace(/^(?=.)/gm, `    `);
      process.stderr.write(`    エラー: ${filepaths[0]}${message}`);
      return false;
    }
  } finally {
    process.stdout.write(
      `${new Date().toLocaleTimeString()} - tsc4wsh 終了.\n`
    );
  }
}

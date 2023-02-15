import * as path from 'path';
import ts from 'typescript';
import { error } from './utils';

function findFileInUpper(source: string, filename: string): string | undefined {
  let dirpath = source;
  while (true) {
    const newdirpath = path.dirname(dirpath);
    // istanbul ignore next
    if (dirpath === newdirpath) {
      // ルートまで行っても見つからなかった
      return undefined;
    }
    dirpath = newdirpath;
    const packageJson = path.join(dirpath, 'package.json');
    if (ts.sys.fileExists(packageJson)) {
      return packageJson;
    }
  }
}

// istanbul ignore next
function loadPackageJson(source: string): [string | undefined, any] {
  const packageJson = findFileInUpper(source, 'package.json');
  if (packageJson) {
    const content = ts.sys.readFile(packageJson, 'utf8');
    if (content) {
      return [packageJson, JSON.parse(content)];
    }
  }
  return [undefined, undefined];
}

function loadTsConfigFile(source: string): [any, string | null] {
  const tsconfig = findFileInUpper(source, 'tsconfig.json');
  // istanbul ignore next tsconfigが見つからないことは想定していない
  if (!tsconfig) {
    return [null, null];
  }
  const {config, error} = ts.readConfigFile(tsconfig, ts.sys.readFile);
  // istanbul ignore next どういう時にエラーになるか分からないのでテスト省略
  if (error) {
    throw new Error(error.toString());
  }
  return [config, tsconfig];
}

function adjustConfig(config: {[key: string]: any}) {
  // 上書きする設定値
  Object.assign(config, {
    // JScriptはES3相当
    target: 'es3',
    // モジュール化は使用できない
    module: 'none',
    // 一つのファイルにまとめるのでoutFileを指定する。
    outFile: './dummy.js',
    // generatorを使えるように
    downlevelIteration: true,
    // 型チェックを厳しく
    strict: true,
    // デフォルトで読み込む定義ファイル
    types: ['wsh', 'windows-script-host', 'activex-scripting', 'activex-adodb'],
    // エラー発生時は出力しない
    noEmitOnError: true,
    // 最近のtscはこれがないと警告を出す
    forceConsistentCasingInFileNames: true,
  });
  // 無ければ補完する設定値
  // libの指定が無ければESNextを指定
  // istanbul ignore next
  if (!config.lib) {
    config.lib = ['ESNext'];
  }
  return config;
}

export function generateTSConfig() {
  const config = {compilerOptions: adjustConfig({})};
  // private-modulesをtypeRootsに指定
  const p = process.cwd();
  const p1 = path.join(__dirname, '../private-modules');
  const p2 = path.join(p1, '@types');
  config.compilerOptions.typeRoots = [
    path.relative(p, p1).replace(/\\/g, '/'),
    path.relative(p, p2).replace(/\\/g, '/'),
  ];
  ts.sys.writeFile(
    path.resolve(p, 'tsconfig.json'),
    JSON.stringify(config, undefined, 2)
  );
}

// istanbul ignore next エラーの発生条件が分からないのでテスト省略
function diagnosticToText(diag: ts.Diagnostic): string {
  if (!diag.file) {
    return ts.flattenDiagnosticMessageText(diag.messageText, '\n');
  }
  const {line, character} = diag.file.getLineAndCharacterOfPosition(
    diag.start!
  );
  const message = ts.flattenDiagnosticMessageText(diag.messageText, '\n');
  return `${diag.file.fileName} (${line + 1},${character + 1}): ${message}`;
}
/**
 * ActiveXObjectNameMapインターフェイスの宣言からprogidと型のマッピングを生成
 */
function generateActiveXObjectNameMap(program: ts.Program) {
  const map: {[type: string]: string} = {};
  for (const file of program.getSourceFiles()) {
    // globalに宣言されているinterfaceだけを検索するのでfileのstatementsだけを見る
    for (const statement of file.statements) {
      // ActiveXObjectNameMapのinterface宣言だけを探す
      if (!ts.isInterfaceDeclaration(statement)) {
        continue;
      }
      if (statement.name.text !== 'ActiveXObjectNameMap') {
        continue;
      }
      // プロパティの名前と型を取得
      for (const member of statement.members) {
        /* istanbul ignore next memberがActiveXObjectNameMapのプロパティでないことはないはず */
        if (!ts.isPropertySignature(member)) {
          continue;
        }
        /* istanbul ignore next ActiveXObjectNameMapのプロパティのタイプが指定されていないことはないはず */
        if (!member.type) {
          continue;
        }
        const name = member.name
          .getText(file)
          .replace(/^(['"`'])(.*)\1$/, '$2');
        const type = member.type.getText(file);
        // 重複していた場合TypeScriptがエラーを出すのでここではチェックしない
        map[type] = name;
      }
    }
  }
  return map;
}
/**
 * idとprogidのマッピングを生成
 */
function generateObjectMap(program: ts.Program) {
  const activeXmap = generateActiveXObjectNameMap(program);
  const objectMap: {[id: string]: string} = {};
  // ソースからdeclare const fso: Scripting.FileSystemObject;のような宣言を探す
  function searchVariableDeclaration(
    block: ts.SourceFile | ts.ModuleBlock,
    file: ts.SourceFile
  ) {
    for (const statement of block.statements) {
      if (ts.isVariableStatement(statement)) {
        for (const decl of statement.declarationList.declarations) {
          // ActiveXObjectNameMapのプロパティで使われている型が指定されている変数を探す
          if (!decl.type) {
            continue;
          }
          const type = decl.type.getText(file);
          if (!(type in activeXmap)) {
            continue;
          }
          // 変数名
          const name = decl.name.getText(file);
          if (name in objectMap) {
            // 同じ変数名で違う型を宣言していたらエラー
            /* istanbul ignore next エラーの発生条件が分からないのでテスト省略 */
            if (objectMap[name] !== activeXmap[type]) {
              throw new Error(
                `同じIDで違う型が宣言されています。: ${objectMap[name]}: {objectMap[name]}、${type}$`
              );
            }
            // 同じ型なら問題なし
            continue;
          }
          objectMap[name] = activeXmap[type];
        }
        continue;
      }
      if (ts.isModuleDeclaration(statement)) {
        // ModuleDeclarationのときはModuleDeclaration以外になるまでbodyをたぐる
        let s = statement;
        while (s.body && ts.isModuleDeclaration(s.body)) {
          s = s.body;
        }
        // ModuleBlockを見つけたら再帰
        /* istanbul ignore next どういうときにModuleBlockができるのかよく分かっていないのでテスト省略 */
        if (s.body && ts.isModuleBlock(s.body)) {
          searchVariableDeclaration(s.body, file);
        }
      }
    }
  }
  for (const file of program.getSourceFiles()) {
    searchVariableDeclaration(file, file);
  }
  return objectMap;
}

export function transpile(fileNames: string[]) {
  // node_modules以下のソースファイルが取り込まれないので定義ファイル以外は出力用と見なされるように小細工
  // ※Typescriptのバージョンアップによって要変更の可能性あり
  (ts as any).getSourceFilesToEmit = function getSourceFilesToEmit(
    host: {getSourceFiles(): ts.SourceFile[]},
    _targetSourceFile: ts.SourceFile,
    _forceDtsEmit: boolean
  ) {
    return host
      .getSourceFiles()
      .filter(sourceFile => !sourceFile.isDeclarationFile);
  };
  const [config, tsconfigPath] = loadTsConfigFile(fileNames[0]);
  /* istanbul ignore next */
  const adjustedConfig = adjustConfig(config?.compilerOptions ?? {});
  /* istanbul ignore next */
  const tsbasedir = path.dirname(tsconfigPath || fileNames[0]);
  const {options: compilerOptions, errors: coError} =
    ts.convertCompilerOptionsFromJson(adjustedConfig, tsbasedir);
  /* istanbul ignore next */
  if (coError && coError.length) {
    /* istanbul ignore next エラーの発生条件が分からないのでテスト省略 */
    throw new Error(coError.join('\n'));
  }
  // private-modulesがtypeRootsにない場合でもコンパイルできるように追加
  /* istanbul ignore next */
  (compilerOptions.typeRoots ??= []).push(
    path.join(__dirname, '../private-modules'),
    path.join(__dirname, '../private-modules/@types')
  );
  const program = ts.createProgram(fileNames, compilerOptions);

  // 参照しているライブラリが実装を含んでいた場合、実装スクリプトを追加する
  let pkgscripts = '';
  // WshRuntimeという名前のテンプレートリテラルがあればruntime要素の中身としてWSFに書き込む
  const runtimes: string[] = [];
  // VBScriptという名前のテンプレートリテラルがあればVBScriptとしてWSFに書き込む
  const vbscripts: string[] = [];
  // @onendが付いた関数は最後に呼び出す
  const onend: string[] = [];
  for (const source of program.getSourceFiles()) {
    // ソースの一番外側のスコープにあるステートメントからWshRuntime/VBScriptテンプレートリテラルを探す
    for (let i = 0; i < source.statements.length; ++i) {
      const statement = source.statements[i];
      if (
        ts.isExpressionStatement(statement) &&
        ts.isTaggedTemplateExpression(statement.expression) &&
        ts.isIdentifier(statement.expression.tag) &&
        ['WshRuntime', 'VBScript'].includes(statement.expression.tag.text) &&
        ts.isNoSubstitutionTemplateLiteral(statement.expression.template) &&
        statement.expression.template.rawText
      ) {
        if (statement.expression.tag.text === 'WshRuntime') {
          runtimes.push(statement.expression.template.rawText);
        } else {
          vbscripts.push(statement.expression.template.rawText);
        }
        // 見つけたら強引にステートメントを削除
        (source.statements as unknown as unknown[]).splice(i, 1);
        --i;
        continue;
      }
      // ソースの一番外側のスコープで宣言されている引数を持たない名前付き関数
      if (
        ts.isFunctionDeclaration(statement) &&
        statement.name &&
        statement.parameters.length === 0
      ) {
        // 関数の前のコメントから@～を抽出
        const tags: {[name: string]: string} = {};
        // functionの前のコメント部分を抽出
        const re =
          /\/\/[ \t]*([^\r\n]*?)[ \t]*\r?\n|\/\**\s*(.*?)\s*\*\/|\s+|(.)/gs;
        re.lastIndex = statement.pos;
        let matched;
        while ((matched = re.exec(source.text))) {
          const [, lineComment, blockComment, notFound] = matched;
          if (notFound) {
            // コメント以外が見つかったので終了
            break;
          }
          if (lineComment !== undefined) {
            // 一行コメント
            const [, tagname, parameters] =
              /^@(\w+)(?:\((.*)\))?$/.exec(lineComment) ?? [];
            if (tagname) {
              tags[tagname] = parameters;
            }
            continue;
          }
          if (blockComment !== undefined) {
            // ブロックコメント
            for (const line of blockComment
              // 1行ごとに分割
              .split(/\r?\n/)
              // 行頭の*と空白、行末の空白を除去
              .map(line => line.replace(/^\s*\*\s*|\s+$/g, ''))) {
              const [, tagname, parameters] =
                /^@(\w+)(?:\((.*)\))?$/.exec(line) ?? [];
              if (tagname) {
                tags[tagname] = parameters;
              }
            }
            continue;
          }
        }
        // @onendがあったらその関数をスクリプトの最後に呼び出し
        if ('onend' in tags) {
          onend.push(statement.name.text);
        }
      }
    }
    if (fileNames.includes(source.fileName)) {
      continue;
    }
    const [pkgpath, pkg] = loadPackageJson(source.fileName);
    // istanbul ignore next
    if (!pkgpath || !pkg) {
      continue;
    }
    if (!pkg.types || !pkg.main) {
      continue;
    }
    // typesプロパティをpackage.jsonからの相対パスとして検索、`.d.ts`が末尾になければ追加
    // istanbul ignore next
    const typesPath = path
      .join(
        path.dirname(pkgpath),
        (pkg.types as string).endsWith('.d.ts')
          ? pkg.types
          : pkg.types + '.d.ts'
      )
      .replace(/\\/g, '/');
    // ソースファイルと一致しなければ無視
    // istanbul ignore next
    if (typesPath !== source.fileName) {
      continue;
    }
    // 実装スクリプトを追加
    const mainPath = path.join(path.dirname(pkgpath), pkg.main);

    // istanbul ignore next
    const pkgscript = ts.sys
      .readFile(mainPath, 'utf8')
      ?.replace(/\r\n/g, '\n')
      .replace(/^(?!\n)/, '\n')
      .replace(/[^\n]$/, '$&\n');
    // istanbul ignore next
    if (pkgscript !== undefined) {
      pkgscripts += pkgscript;
    }
  }

  let script = '';
  const objectMap = generateObjectMap(program);
  const emitResult = program.emit(undefined, (_, data) => {
    script += data;
  }, undefined, undefined, {
    before: [(context: ts.TransformationContext) => {
      return (source: ts.SourceFile) => {
        const visitor = (node: ts.Node): ts.Node => {
          node = ts.visitEachChild(node, visitor, context);
          // ES2015以降は配列リテラルの最後のコンマは無視されるがES5以前では最後にundefinedが追加されてしまうので取り除く
          if (
            ts.isArrayLiteralExpression(node) &&
            node.elements.hasTrailingComma
          ) {
            const elements = context.factory.createNodeArray(
              node.elements,
              false
            );
            return context.factory.createArrayLiteralExpression(
              elements,
              node.getText(source).includes('\n')
            );
          }
          // Symbol.forはforが予約語のためエラーになるのでSymbol['for']に置き換える
          if (
            ts.isPropertyAccessExpression(node) &&
            node.getText(source) === 'Symbol.for'
          ) {
            return context.factory.createElementAccessExpression(
              node.expression,
              context.factory.createStringLiteral('for', true)
            );
          }
          // 正規表現の未サポート仕様のチェック
          if (ts.isRegularExpressionLiteral(node)) {
            const literal = node.getText();
            // パターン部分とフラグ部分に分割
            const [, pattern, flags] =
              /^\/(.*?)\/(\w*)$/.exec(literal) ??
              error`正規表現はこのパターンにマッチするはず`;
            // 名前付きキャプチャ、もしくは後読みのパターンがないかチェック
            const [, pre, named, lookbehind] =
              /^([^\\]*?(?:\\.[^\\]*?)*?)\(\?<(?:(\w+>)|([=!]))/.exec(
                pattern
              ) ?? [];
            // エラー発生箇所表示用
            const {line, character} = source.getLineAndCharacterOfPosition(
              node.getStart()
            );
            if (named) {
              throw new Error(
                `JScriptでは名前付きキャプチャはサポートされていません。: ${literal}\n${
                  source.fileName
                }:${line + 1}:${character + 1 + pre.length + 1}`
              );
            }
            if (lookbehind) {
              throw new Error(
                `JScriptでは後読みはサポートされていません。: ${literal}\n${
                  source.fileName
                }:${line + 1}:${character + 1 + pre.length + 1}`
              );
            }
            if (/[^gim]/.test(flags)) {
              throw new Error(
                `JScriptではサポートされていない正規表現のフラグです。: ${literal}\n${
                  source.fileName
                }:${line + 1}:${character + 1 + pattern.length + 2}`
              );
            }
          }
          return node;
        };
        return ts.visitEachChild(source, visitor, context);
      }
    }],
  });

  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);
  /* istanbul ignore next エラーの発生条件が分からないのでテスト省略 */
  if (allDiagnostics.length) {
    /* istanbul ignore next */
    const errorMessages: string[] = [];
    /* istanbul ignore next */
    for (const diagnostic of allDiagnostics) {
      /* istanbul ignore next */
      errorMessages.push(diagnosticToText(diagnostic));
      /* istanbul ignore next */
      if (!diagnostic.relatedInformation) {
        /* istanbul ignore next */
        continue;
      }
      for (const info of diagnostic.relatedInformation) {
        /* istanbul ignore next */
        errorMessages.push(diagnosticToText(info).replace(/^(?=.)/gm, '    '));
      }
    }
    /* istanbul ignore next */
    throw new Error(errorMessages.join('\n'));
  }

  script =
    // 参照しているライブラリの実装スクリプト
    pkgscripts +
    // 'use strict';が有効になるようにfunctionで囲む
    '(function () {\n' +
    script
      // ]]>はCDATAセクションの終端なので]]\x3eに置換。コード上にある`]]>`はトランスパイルされると`]] >`になるので考えなくていい。
      .replace(/\]\]>/g, ']]\\x3e')
      // テンプレートリテラル内の日本語がエスケープされてしまうのでデコード
      .replace(/(?:\\u(?:(?!00[01][0-9a-f]|007f)[0-9a-f]{4}))+/gi, hexEncoded =>
        String.fromCharCode(
          ...hexEncoded
            .split('\\u')
            .splice(1)
            .map(hex => parseInt(hex, 16))
        )
      ) +
    // @onendが付けられた関数をスクリプトの最後で呼び出す
    onend.map(funcname => funcname + '();\n').join('') +
    '})();';

  return {script, objectMap, runtimes, vbscripts};
}

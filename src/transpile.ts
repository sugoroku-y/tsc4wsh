import {DOMParser} from '@xmldom/xmldom';
import * as path from 'path';
import * as fs from 'fs';
import ts from 'typescript';
import {assert, indented} from './utils';

/** JScriptの予約語 */
const RESERVED = [
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'enum',
  'export',
  'extends',
  'false',
  'finally',
  'for',
  'function',
  'if',
  'import',
  'in',
  'instanceof',
  'new',
  'null',
  'return',
  'super',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'enum',
];

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
  // ネットワークドライブのパスがUNCパスに変換されていることがあるので常にUNCパスに変換して相対パス解決する
  const p = fs.realpathSync.native(process.cwd());
  const p1 = path.join(fs.realpathSync.native(__dirname), '../private-modules');
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
  const sourcePath = (sourcePath => {
    // ネットワークドライブがUNCパスに変換されていることがあるのでどちらもUNCパスに変換してから相対パス解決する。
    if (!path.isAbsolute(sourcePath)) {
      return sourcePath;
    }
    const relativePath = path.relative(
      fs.realpathSync.native(process.cwd()),
      sourcePath
    );
    // path.relativeの結果も絶対パスならもとのままにする
    return path.isAbsolute(relativePath)
      ? sourcePath
      : relativePath.replaceAll('\\', '/');
  })(diag.file.fileName);
  return `${sourcePath} (${line + 1},${character + 1}): ${message}`;
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
        assert(
          ts.isPropertySignature(member),
          'memberがActiveXObjectNameMapのプロパティでないことはないはず'
        );
        assert(
          member.type,
          'ActiveXObjectNameMapのプロパティのタイプが指定されていないことはないはず'
        );
        assert(
          ts.isStringLiteral(member.name),
          'プロパティの名前は文字列のはず'
        );
        const name = member.name.text;
        assert(
          ts.isTypeReferenceNode(member.type) ||
            ts.isTypeLiteralNode(member.type),
          'プロパティの型が指定されているはず'
        );
        const type = member.type.getText(file);
        // 重複していた場合TypeScriptがエラーを出すのでここではチェックしない
        map[type] = name;
      }
    }
  }
  return map;
}

type ExtendedContext = ts.TransformationContext & Readonly<{
  /** ActiveXObjectNameMapで定義されたprogidと型名のマッピング */
  activeXmap: Readonly<Record<string, string>>;
  /** declare constで宣言された変数と型の情報のマッピング */
  objectMap: Record<string, {
    /** 変数を宣言しているソースファイル */
    source: ts.SourceFile;
    /** 変数を宣言している位置 */
    start: number;
    /** 変数の型名 */
    type: string;
    /** 型に対応するprogid */
    progid: string;
  }>;
  /** エラー情報 */
  diagnostics: ts.Diagnostic[];
  /** 最後に実行する関数の名前 */
  onend: string[];
  /** VBScriptの内容 */
  vbscripts: string[];
  /** WshRuntimeの内容 */
  runtimes: ChildNode[];
}>;

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
  let pkgscripts = ''.concat(
    ...(function* () {
      for (const source of program.getSourceFiles()) {
        // transpile対象のソースは除外
        if (fileNames.includes(source.fileName)) {
          continue;
        }
        // ソースが含まれているパッケージのpackage.jsonを検索
        const [pkgpath, pkg] = loadPackageJson(source.fileName);
        // istanbul ignore next 見つからないことはないはずだが念の為
        if (!pkgpath || !pkg) {
          continue;
        }
        // typesやmainが無いものは無視
        if (!pkg.types || !pkg.main) {
          continue;
        }
        // typesプロパティをpackage.jsonからの相対パスとして検索、`.d.ts`が末尾になければ追加
        // istanbul ignore next
        const typesPath = path
          .join(
            path.dirname(pkgpath),
            pkg.types.replace(/(?<!\.d\.ts)$/, '.d.ts')
          )
          // Windows環境向けにパス区切り文字を置換
          .replace(/\\/g, '/');
        // istanbul ignore next ソースファイルと一致しなければ無視
        if (typesPath !== source.fileName) {
          continue;
        }
        // 実装スクリプトを追加
        const mainPath = path.join(path.dirname(pkgpath), pkg.main);

        const mainSource = ts.sys.readFile(mainPath, 'utf8');
        // istanbul ignore next
        if (!mainSource) {
          continue;
        }
        // 改行の補正(CRLFをLFに、先頭や末尾になければLF追加)
        yield mainSource.replace(/^\r\n|^(?!\n)|\r\n|(?<!\n)$/g, '\n');
      }
    })()
  );

  // WshRuntimeという名前のテンプレートリテラルがあればruntime要素の中身としてWSFに書き込む
  const runtimes: ChildNode[] = [];
  // VBScriptという名前のテンプレートリテラルがあればVBScriptとしてWSFに書き込む
  const vbscripts: string[] = [];
  // @onendが付いた関数は最後に呼び出す
  const onend: string[] = [];
  const activeXmap = generateActiveXObjectNameMap(program);
  const objectMap: Record<string,
    {
      source: ts.SourceFile;
      start: number;
      type: string;
      progid: string;
    }
  > = {};
  // エラー情報
  const diagnostics: ts.Diagnostic[] = [];
  let script = '';
  const emitResult = program.emit(
    undefined,
    (_, data) => {
      script += data;
    },
    undefined,
    undefined,
    {
      before: [
        (_context: ts.TransformationContext) => {
          const context: ExtendedContext = {
            ..._context,
            activeXmap,
            objectMap,
            diagnostics,
            onend,
            vbscripts,
            runtimes,
          };
          return (source: ts.SourceFile) => {
            return ts.visitEachChild(
              source,
              function visitor(_node: ts.Node): ts.Node | undefined {
                const node = ts.visitEachChild(_node, visitor, context);
                return (
                  processDeclareConstActiveX(node, context) ??
                  processTaggedGlobalFunction(node, context) ??
                  processArrayLiteralExpression(node, context) ??
                  processKeywordPropertyAccess(node, context) ??
                  checkRegularExpressionForJScript(node, context) ??
                  processPseudoTaggedTemplateLiteral(node, context) ?? {node}
                ).node;
              },
              context
            );
          };
        },
      ],
      after: [
        (context: ts.TransformationContext) => {
          return (source: ts.SourceFile) => {
            return ts.visitEachChild(
              source,
              function visitor(_node: ts.Node): ts.Node {
                const node = ts.visitEachChild(_node, visitor, context);
                return (processStringLiteral(node, context) ?? {node}).node;
              },
              context
            );
          };
        },
      ],
    }
  );

  // プログラム上のエラー、出力時のエラー、tsc4wsh固有のエラーをすべて並べる
  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics, diagnostics);
  if (allDiagnostics.length) {
    // すべてのエラーメッセージを配列化
    const errorMessages = allDiagnostics.flatMap(diagnostic => [
      diagnosticToText(diagnostic),
      ...(diagnostic.relatedInformation?.map(info =>
        diagnosticToText(info).replace(/^(?=.)/gm, '    ')
      ) ?? []),
    ]);
    if (
      allDiagnostics.some(diag => diag.category === ts.DiagnosticCategory.Error)
    ) {
      // エラーがあれば例外を投げる
      throw new Error(errorMessages.join('\n'));
    } else {
      // エラー以外のものだけであれば出力するだけで続行
      process.stderr.write(
        errorMessages.map(message => `    ${message}\n`).join('')
      );
    }
  }

  script = indented`
    ${
      // 参照しているライブラリの実装スクリプト
      pkgscripts
    }
    (function () {
    ${
      // ↑'use strict';が有効になるようにfunctionで囲む
      // ]]>はCDATAセクションの終端なので]]\x3eに置換。コード上にある`]]>`はトランスパイルされると`]] >`になるので考えなくていい。
      script.replace(/\]\]>/g, ']]\\x3e')
    }
    ${
      // @onendが付けられた関数をスクリプトの最後で呼び出す
      onend.map(funcname => `${funcname}();\n`).join('')
    }
    })();
    `;

  return {script, objectMap, runtimes, vbscripts};
}

function processDeclareConstActiveX(
  node: ts.Node,
  {activeXmap, objectMap, diagnostics}: ExtendedContext
): {node?: ts.Node} | undefined {
  if (
    !ts.isVariableStatement(node) ||
    !ts
      .getModifiers(node)
      ?.some(mod => mod.kind === ts.SyntaxKind.DeclareKeyword) ||
    (node.declarationList.flags & ts.NodeFlags.Const) === 0
  ) {
    // declare const でなければスキップ
    return undefined;
  }
  for (const decl of node.declarationList.declarations) {
    // ActiveXObjectNameMapのプロパティで使われている型が指定されている変数を探す
    if (!decl.type) {
      continue;
    }
    const type = decl.type.getText();
    if (!(type in activeXmap)) {
      continue;
    }
    const progid = activeXmap[type];
    if (!ts.isIdentifier(decl.name)) {
      continue;
    }
    // 変数名
    const name = decl.name.text;
    if (name in objectMap) {
      // すでに同名の変数が宣言されていた場合
      if (objectMap[name].progid !== progid) {
        // 違う型だったらエラー
        addDiagnostic(
          diagnostics,
          node,
          `同じ名前で違う型が宣言されています。: ${name}: ${type}`,
          {
            relatedInformation: [
              {
                category: ts.DiagnosticCategory.Error,
                code: 0,
                file: objectMap[name].source,
                start: objectMap[name].start,
                length: undefined,
                messageText: `${name}: ${objectMap[name].type}`,
              },
            ],
          }
        );
      }
      // 同じ型なら問題なし
      continue;
    }
    const found = Object.entries(objectMap).find(
      ([, {progid: existsProgid}]) => progid === existsProgid
    );
    if (found) {
      // 別の名前で同じ型を宣言していたら警告
      assert(
        name !== found[0],
        '同じ名前で同じ型であれば1つ前のチェックでスキップしているはず'
      );
      addDiagnostic(
        diagnostics,
        node,
        `違う名前で同じ型が宣言されています。: ${name}: ${type}`,
        {
          category: ts.DiagnosticCategory.Warning,
          relatedInformation: [
            {
              category: ts.DiagnosticCategory.Error,
              code: 0,
              file: found[1].source,
              start: found[1].start,
              length: undefined,
              messageText: `${found[0]}: ${found[1].type}`,
            },
          ],
        }
      );
    }
    objectMap[name] = {
      progid: activeXmap[type],
      source: node.getSourceFile(),
      start: node.getStart(),
      type,
    };
  }
  return {node};
}

function processTaggedGlobalFunction(
  node: ts.Node,
  {onend}: ExtendedContext
): {node?: ts.Node} | undefined {
  // ソースの一番外側のスコープで宣言されている引数を持たない名前付き関数
  if (
    node.parent !== node.getSourceFile() ||
    !ts.isFunctionDeclaration(node) ||
    !node.name ||
    node.parameters.length !== 0
  ) {
    return undefined;
  }
  // 関数の前のコメントから@～を抽出
  const tags: {[name: string]: string} = {};
  // 関数の前に書かれているコメント
  const comments = node.getSourceFile().text.slice(node.pos, node.getStart());
  for (const line of (function* () {
    for (const [, lineComment, blockComment, unknownText] of comments.matchAll(
      /\/\/[ \t]*([^\r\n]*?)[ \t]*\r?\n|\/\**\s*(.*?)\s*\*\/|\s+|(?<=.)/gs
    )) {
      assert(!unknownText, 'コメントと空白以外は現れないはず');
      if (lineComment !== undefined) {
        // 一行コメント
        yield lineComment;
      } else if (blockComment !== undefined) {
        // ブロックコメント
        for (const line of blockComment
          // 1行ごとに分割
          .split(/\r?\n/)
          // 行頭の*と空白、行末の空白を除去
          .map(line => line.replace(/^\s*\*\s*|\s+$/g, ''))) {
          yield line;
        }
      }
    }
  })()) {
    const [, tagname, parameters] = /^@(\w+)(?:\((.*)\))?$/.exec(line) ?? [];
    if (tagname) {
      tags[tagname] = parameters;
    }
  }
  // @onendがあったらその関数をスクリプトの最後に呼び出し
  if ('onend' in tags) {
    onend.push(node.name.text);
  }
  return {node};
}

function processArrayLiteralExpression(
  node: ts.Node,
  context: ExtendedContext
): {node?: ts.Node} | undefined {
  // ES5以降は配列リテラルの最後のコンマは無視されるがJScriptでは最後にundefinedが追加されてしまうので取り除く
  if (!ts.isArrayLiteralExpression(node) || !node.elements.hasTrailingComma) {
    return undefined;
  }
  const elements = context.factory.createNodeArray(node.elements, false);
  return {
    node: context.factory.createArrayLiteralExpression(
      elements,
      'multiLine' in node && !!node.multiLine
    ),
  };
}

function processKeywordPropertyAccess(
  node: ts.Node,
  context: ExtendedContext
): {node?: ts.Node} | undefined {
  // JScriptではSymbol.forのようにプロパティ名が予約語のときエラーになるのでSymbol['for']のように置き換える
  if (
    !ts.isPropertyAccessExpression(node) ||
    !ts.isIdentifier(node.name) ||
    !RESERVED.includes(node.name.text)
  ) {
    return undefined;
  }
  return {
    node: context.factory.createElementAccessExpression(
      node.expression,
      context.factory.createStringLiteral(node.name.text, true)
    ),
  };
}

function checkRegularExpressionForJScript(
  node: ts.Node,
  {diagnostics}: ExtendedContext
): {node?: ts.Node} | undefined {
  // 正規表現の未サポート仕様のチェック
  if (!ts.isRegularExpressionLiteral(node)) {
    return undefined;
  }
  const literal = node.getText();
  // 名前付きキャプチャ、もしくは後読みのパターンがないかチェック
  let match;
  if (
    (match = /^\/[^\\]*?(?:\\.[^\\]*?)*?(?=(\(\?<\w+>.*?[()]))/.exec(literal))
  ) {
    addDiagnostic(
      diagnostics,
      node,
      `JScriptでは名前付きキャプチャはサポートされていません。: ${match[1]}`,
      {offset: match[0].length}
    );
  }
  if (
    (match = /^\/[^\\]*?(?:\\.[^\\]*?)*?(?=(\(\?<[=!].*?[()]))/.exec(literal))
  ) {
    addDiagnostic(
      diagnostics,
      node,
      `JScriptでは後読みはサポートされていません。: ${match[1]}`,
      {offset: match[0].length}
    );
  }
  if ((match = /(?<=\/)\w*?(?=([dsuy])\w*$)/.exec(literal))) {
    addDiagnostic(
      diagnostics,
      node,
      `JScriptではサポートされていない正規表現のフラグです。: ${match[1]}`,
      {offset: match.index + match[0].length}
    );
  }
  return {node};
}

function processPseudoTaggedTemplateLiteral(
  node: ts.Node,
  {vbscripts, runtimes, diagnostics}: ExtendedContext
): {node?: ts.Node} | undefined {
  if (
    !ts.isExpressionStatement(node) ||
    !ts.isTaggedTemplateExpression(node.expression) ||
    !ts.isIdentifier(node.expression.tag)
  ) {
    return undefined;
  }
  // タグ付きテンプレートリテラルだけのステートメント
  const tagname = node.expression.tag.text;
  switch (tagname) {
    case 'WshRuntime':
    case 'VBScript':
      break;
    // その他のタグ付きテンプレートリテラルはそのまま
    default:
      return undefined;
  }
  // istanbul ignore next 式の挿入はTypeScriptでエラーになるのでcoverageは気にしない
  if (!ts.isNoSubstitutionTemplateLiteral(node.expression.template)) {
    addDiagnostic(diagnostics, node, `${tagname}には式の挿入ができません。`);
    return {};
  }
  if (!node.expression.template.rawText) {
    addDiagnostic(diagnostics, node, `${tagname}の中身が空です。`);
    return {};
  }
  if (tagname === 'VBScript') {
    vbscripts.push(node.expression.template.rawText);
    //ステートメントは削除
    return {};
  }
  const locator = {
    columnNumber: 0,
    lineNumber: 0,
    systemId: '',
  };
  const parser = new DOMParser({
    errorHandler: (_, message) => {
      throw new Error(message);
    },
    locator,
  });
  // `` WshRuntime`～` `` をXMLとしてパーズする
  const runtime = `<WshRuntime>${node.expression.template.rawText.replaceAll(
    '\r\n',
    '\n'
  )}</WshRuntime>`;
  try {
    const document = parser.parseFromString(runtime);
    for (
      let child = document.documentElement.firstChild;
      child;
      child = child.nextSibling
    ) {
      runtimes.push(child);
    }
  } catch (ex) {
    // runtime要素のparseに失敗したらエラー箇所を表示
    const lines = runtime.split(/\r?\n/);
    // エラー箇所より前(最大)3行
    const pre = lines
      .slice(Math.max(locator.lineNumber - 4, 0), locator.lineNumber)
      .map(s => '| ' + s)
      .join('\n');
    // エラー箇所より後(最大)3行
    const post = lines
      .slice(locator.lineNumber, Math.min(locator.lineNumber + 3, lines.length))
      .map(s => '| ' + s)
      .join('\n');
    addDiagnostic(
      diagnostics,
      node,
      indented`
      WshRuntimeの記述に誤りがあります。
      ${pre}
      ${' '.repeat(2 + locator.columnNumber - 1)}^${String(
        // istanbul ignore next
        typeof ex === 'object' && ex && 'message' in ex ? ex.message : ex
      )
        .replace(/\[xmldom (\w+)\]/g, '[$1]')
        .replace(/^@#\[line:\d+,col:\d+\]$/gm, '')
        .replace(/\s+/g, ' ')
        .split(/:\s*Error:\s*/)
        .join('\n' + ' '.repeat(2 + locator.columnNumber))}
      ${post}
      `
    );
  }
  //ステートメントは削除
  return {};
}

function processStringLiteral(
  node: ts.Node,
  context: ts.TransformationContext
): {node: ts.Node} | undefined {
  if (!ts.isStringLiteral(node)) {
    return undefined;
  }
  const singleQuote = 'singleQuote' in node && !!node.singleQuote;
  if (!singleQuote && !node.text.includes("'")) {
    // `"`を使うようになっていて`'`が含まれていないものは`'`を使うように変更
    node = context.factory.createStringLiteral(node.text, true);
  }
  // 非ASCII文字のエスケープを抑制する
  ts.setEmitFlags(node, ts.EmitFlags.NoAsciiEscaping);
  return {node};
}

/**
 * エラー情報を追加する。
 *
 * @param {ts.Diagnostic[]} diagnostics エラー情報の追加先
 * @param {ts.Node} node エラーが発生したノード
 * @param {string} message エラーメッセージ
 * @param {{
 *     offset?: number;
 *     category?: ts.DiagnosticCategory;
 *     relatedInformation?: ts.DiagnosticRelatedInformation[];
 *     length?: number;
 *     code?: number;
 *   }} [options]
 */
function addDiagnostic(
  diagnostics: ts.Diagnostic[],
  node: ts.Node,
  message: string,
  options?: {
    /** エラー発生箇所がノードの開始位置からずれている場合の補正値。省略時は0 */
    offset?: number;
    /** エラーの種類。省略時はError */
    category?: ts.DiagnosticCategory;
    /** 関係する情報。省略時はなし */
    relatedInformation?: ts.DiagnosticRelatedInformation[];
    /** エラー情報に指定するプロパティ。省略時はundefined */
    length?: number;
    /** エラー情報に指定するプロパティ。省略時は0 */
    code?: number;
  }
): void {
  diagnostics.push({
    category: options?.category ?? ts.DiagnosticCategory.Error,
    code:
      // istanbul ignore next
      options?.code ?? 0,
    file: node.getSourceFile(),
    messageText: message,
    start: node.getStart() + (options?.offset ?? 0),
    length: options?.length,
    relatedInformation: options?.relatedInformation,
  });
}

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

function loadTsConfigFile(source: string): [any, string | null] {
  let dirpath = source;
  while (true) {
    const newdirpath = path.resolve(dirpath, '..');
    if (dirpath === newdirpath) {
      // ルートまで行っても見つからなかった
      return [null, null];
    }
    dirpath = newdirpath;
    const tsconfig = path.join(dirpath, 'tsconfig.json');
    // ts.readConfigFileではファイルが存在しないのか、存在していて読み込み時にエラーになったのか区別が付けられないので、先に存在確認する
    if (!ts.sys.fileExists(tsconfig)) {
      // 存在していなければ次
      continue;
    }

    const {config, error} = ts.readConfigFile(tsconfig, ts.sys.readFile);
    if (error) {
      throw new Error(error.toString());
    }
    if (config) {
      return [config, tsconfig];
    }
  }
}

function adjustConfig(config: {[key: string]: any}) {
  // 上書きする設定値
  Object.assign(config, {
    // JScriptはES3相当
    target: 'es3',
    // モジュール化は使用できない
    // tslint:disable-next-line:object-literal-sort-keys
    module: 'none',
    // 一つのファイルにまとめるのでoutFileを指定する。
    outFile: './dummy.js',
    // generatorを使えるように
    downlevelIteration: true,
    // 型チェックを厳しく
    strict: true,
    strictNullChecks: true,
    // デフォルトで読み込む定義ファイル
    types: ['windows-script-host', 'activex-scripting', 'activex-adodb'],
  });
  // 無ければ補完する設定値
  // libの指定が無ければes2018を指定
  if (!config.lib) {
    config.lib = ['es2018'];
  }
  return config;
}

export async function generateTSConfig() {
  const config = {compilerOptions: adjustConfig({})};
  // private-modulesをtypeRootsに指定
  const p = path.resolve('.');
  const p1 = path.join(__dirname, '../private-modules');
  const p2 = path.join(p1, '@types');
  config.compilerOptions.typeRoots = [
    path.relative(p, p1).replace(/\\/g, '/'),
    path.relative(p, p2).replace(/\\/g, '/'),
  ];
  await fs.promises.writeFile(
    path.resolve('tsconfig.json'),
    JSON.stringify(config, undefined, 2),
    'utf8'
  );
}

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
        if (!ts.isPropertySignature(member)) {
          continue;
        }
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
            if (objectMap[name] !== activeXmap[type]) {
              throw new Error(
                `同じIDで違う型が宣言されています。: ${
                  objectMap[name]
                }: {objectMap[name]}、${type}$`
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

export function transpile(
  fileName: string,
  dependencies?: {[filepath: string]: {[filepath: string]: true}}
) {
  const [config, tsconfigPath] = loadTsConfigFile(fileName);
  const adjustedConfig = adjustConfig((config && config.compilerOptions) || {});
  const tsbasedir = path.dirname(tsconfigPath || fileName);
  const {
    options: compilerOptions,
    errors: coError,
  } = ts.convertCompilerOptionsFromJson(adjustedConfig, tsbasedir);
  if (coError && coError.length) {
    throw new Error(coError.join('\n'));
  }
  // private-modulesがtypeRootsにない場合でもコンパイルできるように追加
  (compilerOptions.typeRoots = compilerOptions.typeRoots || []).push(
    path.join(__dirname, '../private-modules'),
    path.join(__dirname, '../private-modules/@types')
  );
  const program = ts.createProgram([fileName], compilerOptions);
  if (dependencies) {
    for (const source of program.getSourceFiles()) {
      (dependencies[source.fileName] = dependencies[source.fileName] || {})[
        fileName
      ] = true;
    }
  }
  let script = '';
  const objectMap = generateObjectMap(program);
  const emitResult = program.emit(
    undefined,
    (filename, data, writeByteOrderMark, onError) => {
      script += data;
    }
  );

  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);
  if (allDiagnostics.length) {
    const errorMessages: string[] = [];
    for (const diagnostic of allDiagnostics) {
      errorMessages.push(diagnosticToText(diagnostic));
      if (!diagnostic.relatedInformation) {
        continue;
      }
      for (const info of diagnostic.relatedInformation) {
        errorMessages.push(diagnosticToText(info).replace(/^(?=.)/gm, '    '));
      }
    }
    throw new Error(errorMessages.join('\n'));
  }

  // Symbol.forはforが予約語なので書き方を変える
  return {script, objectMap};
}

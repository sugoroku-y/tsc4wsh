import * as fs from 'fs';
import * as path from 'path';
import * as wildkarte from 'wildkarte';
import * as optionalist from 'optionalist';
import {generateTSConfig} from './transpile';
import {tsc4wsh, stderr} from './tsc4wsh';

const options = optionalist.parse({
  [optionalist.helpString]: {
    describe: `Windows Scripting Host向けTypeScriptコンパイラ`,
    showUsageOnError: true,
  },
  output: {
    alias: 'o',
    example: 'outputDirOrFile',
    describe: `
      出力先ディレクトリ、もしくは出力先ファイルを指定する。
      拡張子'.wsf'を付けると出力先ファイルと見なす。
      変換対象を複数指定した場合、出力先にファイルを指定するとエラーとなる。`,
  },
  base: {
    alias: 'b',
    example: 'baseDir',
    describe: `基準ディレクトリを指定する。`,
  },
  watch: {
    alias: 'w',
    describe: `ファイルの更新監視を開始するかどうか。`,
    type: 'boolean',
  },
  help: {
    alias: 'h',
    describe: `このヘルプを表示する。`,
    type: 'boolean',
    nature: 'alone',
  },
  init: {
    alias: 'i',
    describe: `tsconfig.jsonを生成する。`,
    type: 'boolean',
    nature: 'alone',
  },
  console: {
    alias: 'c',
    describe: `変換結果をファイルではなく標準出力に表示する。`,
    type: 'boolean',
  },
  [optionalist.unnamed]: {
    example: 'filename',
    describe: `
      コンパイルするファイル
      ファイル名にはワイルドカードを指定可能。
      - * はファイル名、ディレクトリ名の任意の0個以上複数文字にマッチ
      - ? はファイル名、ディレクトリ名の任意の1文字にマッチ
      - {AAA,BBB}はファイル名、ディレクトリ名のAAAかBBBにマッチ
      - ** は下階層のすべてのファイル、ディレクトリにマッチ
      ファイル名を指定しなかった場合には**\\*.tsが指定されたものと見なす。
      -で始まるファイル名を使用したい場合には--を指定したあとにファイル名を指定する。
      ただし、その場合--以降でその他のオプションは指定できない。`,
  },
});

async function ensureDir(p: string) {
  const d = path.dirname(p);
  // 存在確認だけでなくディレクトリかどうかもチェック
  const stat = await fs.promises.stat(d).catch(ex => {
    if (ex.code === 'ENOENT') {
      return null;
    }
    throw ex;
  });
  if (stat?.isDirectory()) {
    // ディレクトリとして存在していれば何もしないで終了
    return;
  }
  await ensureDir(d);
  await fs.promises.mkdir(d);
}

if ('help' in options) {
  stderr.write(options[optionalist.helpString]);
  process.exit(0);
}

if ('init' in options) {
  generateTSConfig();
  process.exit(0);
}

// ファイル指定なしの場合はカレントディレクトリ以下にあるすべてのtsファイルを対象とする
const patterns =
  options[optionalist.unnamed].length > 0
    ? options[optionalist.unnamed]
    : ['**/*.ts'];

let gitIgnore: ((item: wildkarte.IItem) => boolean | undefined) | undefined;
// ワイルドカードを展開
const filelist = patterns
  .map(pattern => [
    ...wildkarte.expand(pattern, item => {
      if (item.stat.isDirectory()) {
        gitIgnore = loadGitignore(item.path, gitIgnore);
      }
      return gitIgnore?.(item) ?? false;
    }),
  ])
  .reduce((a, b) => a.concat(b))
  .map(item => item.path);

if (filelist.length === 0) {
  stderr.write(
    `ファイルが見つかりません。: \n${patterns.map(s => `    ${s}\n`).join('')}`
  );
  process.exit(1);
}

if (options.output && /\.wsf$/i.test(options.output) && filelist.length > 1) {
  stderr.write(
    `複数のソースファイルが指定されましたが、出力先にファイルが指定されています。: ${options.output}\n`
  );
  process.exit(1);
}
if (options.watch && options.console) {
  stderr.write(
    `ファイル更新監視時は変換結果の出力先に標準出力を指定できません。\n`
  );
  process.exit(1);
}

(async () => {
  if (options.output) {
    const output = /\.wsf$/i.test(options.output)
      ? options.output
      : path.join(options.output, 'dummy.wsf');
    await ensureDir(output);
  }

  if (!options.watch) {
    const result = await tsc4wsh(filelist, options);
    process.exit(result ? 0 : 1);
  }

  let timerId: ReturnType<typeof setTimeout> | undefined;
  let scheduled: {[filepath: string]: true} = {};
  const dependencies: {[filepath: string]: {[filepath: string]: true}} = {};
  await tsc4wsh(filelist, dependencies);
  for (const filepath of Object.keys(dependencies)) {
    fs.watch(filepath, () => {
      if (timerId) {
        clearTimeout(timerId);
      }
      const map = dependencies[filepath];
      if (!map) {
        return;
      }
      for (const source of Object.keys(map)) {
        scheduled[source] = true;
      }
      timerId = setTimeout(() => {
        timerId = undefined;
        const activated = Object.keys(scheduled);
        scheduled = {};
        // ビルドするファイルの依存関係をクリア
        for (const f of Object.keys(dependencies)) {
          for (const s of activated) {
            delete dependencies[f][s];
          }
        }
        tsc4wsh(activated, options, dependencies);
      }, 1000);
    });
  }
})();

function loadGitignore(
  dirpath: string,
  filterFunc?: (item: wildkarte.IItem) => boolean | undefined
) {
  const gitignorePath = path.join(dirpath, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    return filterFunc;
  }
  if (!fs.statSync(gitignorePath).isFile()) {
    return filterFunc;
  }
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  const gitignore = gitignoreContent
    .split(/(?:\r?\n)+/)
    // #で始まる行はコメント
    .filter(line => line && !/^#/.test(line))
    .map(line => {
      let pattern = line;
      let directoryOnly = false;
      let negative = false;
      // /で終わっていればディレクトリだけにマッチ
      if (/\/$/.test(pattern)) {
        pattern = pattern.replace(/\/+/, '');
        directoryOnly = true;
      }
      // `!`で始まっていればそれまでにマッチしていたものがあっても除外
      if (/^!/.test(pattern)) {
        pattern = pattern.substr(1);
        negative = true;
      }
      // 先頭に\があれば次の文字をエスケープ
      pattern = pattern.replace(/^\\/, '');
      // /を含むパターンは.gitignoreのあるディレクトリからの相対パス
      const nameOnly = !pattern.includes('/');
      // 先頭の/は除外して正規表現に変換
      if (/^\//.test(pattern)) {
        pattern = pattern.substr(1);
      }
      // 名前だけかパスを含むかで正規表現への変換方法を変える
      const re = wildkarte.toRegExp(
        pattern,
        nameOnly ? wildkarte.FOR_FILENAME : wildkarte.FOR_PATH
      );
      return {directoryOnly, negative, nameOnly, re};
    });
  return (item: wildkarte.IItem) => {
    let state: boolean | undefined;
    // .gitignoreからの相対パス
    const rel = path.relative(dirpath, item.path).replace(/\\/g, '/');
    if (rel.startsWith('../')) {
      // .gitignoreのあるディレクトリ以下にあるファイル/ディレクトリではないのでスキップ
      return filterFunc?.(item);
    }
    for (const pattern of gitignore) {
      // ディレクトリにだけマッチするものはディレクトリ以外のときはスキップ
      if (pattern.directoryOnly && !item.stat.isDirectory()) {
        continue;
      }
      // パターンにマッチしないものはスキップ
      if (pattern.nameOnly) {
        // 名前だけにマッチするものは名前だけをチェック
        if (!pattern.re.test(item.name)) {
          continue;
        }
      } else {
        // .gitignoreからの相対パスでチェック
        if (!pattern.re.test(rel)) {
          continue;
        }
      }
      // パターンにマッチしたら反転かどうかによって状態を変更
      state = !pattern.negative;
    }
    if (state === undefined) {
      // 現在の.gitignoreにあるパターンすべてにマッチしない場合は親フォルダのパターンをチェック
      return filterFunc?.(item);
    }
    return state;
  };
}

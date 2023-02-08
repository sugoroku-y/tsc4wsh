import * as fs from 'fs';
import * as path from 'path';
import * as wildkarte from 'wildkarte';
import * as optionalist from 'optionalist';
import {generateTSConfig} from './transpile';
import {tsc4wsh} from './tsc4wsh';

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
      出力先にディレクトリを指定した場合は、先頭のファイルの拡張子を
      '.wsf'にしたものを出力先ファイルとする。
      先頭のファイルにワイルドカードを指定した場合は、
      最初に見つかったファイルが出力先ファイル名の元になるので、
      想定していないファイル名になることがあることに注意。`,
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

if ('help' in options) {
  process.stderr.write(options[optionalist.helpString]);
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

function concat(
  ...generators: Array<(start: string) => AsyncGenerator<string, void>>
): (start: string) => Promise<string[]> {
  return async function (start: string) {
    const result: string[] = [];
    for (const g of generators) {
      for await (const path of g(start)) {
        result.push(path);
      }
    }
    return result;
  };
}

if (options.watch && options.console) {
  process.stderr.write(
    `ファイル更新監視時は変換結果の出力先に標準出力を指定できません。\n`
  );
  process.exit(1);
}

(async () => {
  // ワイルドカードを展開
  const filelist = await concat(
    ...patterns.map(pattern => wildkarte.expand(pattern.replace(/\\/g, `/`)))
  )(process.cwd());
  if (filelist.length === 0) {
    process.stderr.write(
      `ファイルが見つかりません。: \n${patterns
        .map(s => `    ${s}\n`)
        .join('')}`
    );
    process.exit(1);
  }

  if (!options.watch) {
    const result = await tsc4wsh(filelist, options);
    process.exit(result ? 0 : 1);
  }

  let timerId: ReturnType<typeof setTimeout> | undefined;
  let scheduled: {[filepath: string]: true} = {};
  await tsc4wsh(filelist, options);
  for (const filepath of filelist) {
    fs.watch(filepath, () => {
      if (timerId) {
        clearTimeout(timerId);
      }
      scheduled[filepath] = true;
      timerId = setTimeout(() => {
        timerId = undefined;
        const activated = Object.keys(scheduled);
        scheduled = {};
        tsc4wsh(activated, options);
      }, 1000);
    });
  }
})();

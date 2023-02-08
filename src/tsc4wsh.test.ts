import * as fs from 'fs';
import * as path from 'path';
import {tsc4wsh} from './tsc4wsh';
import {generateTSConfig} from './transpile';
import {isDirectory, isFile, mkdirEnsure, rmdirEnsure, unlinkEnsure} from "./utils";

jest.setTimeout(40000);

describe('tsc4wsh', () => {

  test.each`
    filename
    ${'delay-startup'}
    ${'eval'}
    ${'filever'}
    ${'msiinfo'}
    ${'test-reference'}
    ${'test'}
    ${'test-error'}
  `('transpile $filename', async ({filename}: {filename: string}) => {
    const tsfile = `test/${filename}.ts`;
    const wsffile = `test/${filename}.xml`;
    const expectwsffile = `test/expect/${filename}.xml`;
    const expectoutfile = `test/expect/${filename}.out`;
    const expecterrfile = `test/expect/${filename}.err`;
    const existExpect = await isFile(expectwsffile);
    const existOut = await isFile(expectoutfile);
    const existErr = await isFile(expecterrfile);
    await unlinkEnsure(wsffile);
    let stdoutText = '';
    let stderrText = '';
    const mockOut = jest.spyOn(process.stdout, 'write').mockImplementation((...args) => {
      stdoutText += args[0];
      return true;
    });
    const mockErr = jest.spyOn(process.stderr, 'write').mockImplementation((...args) => {
      stderrText += args[0];
      return true;
    });
    try {
      expect(await tsc4wsh([tsfile], { output: wsffile })).toBe(existExpect);
      if (existExpect) {
        expect(await fs.promises.readFile(wsffile, 'utf8')).toBe(
          await fs.promises.readFile(expectwsffile, 'utf8')
        );
      }
      if (existOut) {
        expect(stdoutText).toBe(
          await fs.promises.readFile(expectoutfile, 'utf8')
        );
      } else if (stdoutText) {
        //   await fs.promises.writeFile(expectoutfile, stdoutText, 'utf8');
        // console.log(stdoutText);
      }
      if (existErr) {
        expect(stderrText).toBe(
          await fs.promises.readFile(expecterrfile, 'utf8')
        );
      } else if (stderrText) {
        //   await fs.promises.writeFile(expecterrfile, stderrText, 'utf8');
        console.error(stderrText);
      }
    } finally {
      mockOut.mockRestore();
      mockErr.mockRestore();
    }
  });
  test('output to not-existence', async () => {
    const mockOut = jest.spyOn(process.stdout, 'write');
    const mockErr = jest.spyOn(process.stderr, 'write');
    try {
      const output = 'test/temp/test2.xml';
      // test/temp/test2が存在していれば削除
      await unlinkEnsure(output);
      expect(await tsc4wsh(['test/test.ts'], { output })).toBe(true);
    } finally {
      mockOut.mockRestore();
      mockErr.mockRestore();
    }
  });
  test('output to same file ', async () => {
    const mockOut = jest.spyOn(process.stdout, 'write');
    const mockErr = jest.spyOn(process.stderr, 'write');
    try {
      const output = 'test/temp/test3.xml';
      expect(await tsc4wsh(['test/test.ts'], { output })).toBe(true);
      // 同じ内容を同じファイルに出力
      expect(await tsc4wsh(['test/test.ts'], { output })).toBe(true);
    } finally {
      mockOut.mockRestore();
      mockErr.mockRestore();
    }
  });
});

test('generateTSConfig', async () => {
  await mkdirEnsure('test/temp');
  const cwdsave = process.cwd();
  try {
    process.chdir('test/temp');
    generateTSConfig();
    const config = JSON.parse(
      await fs.promises.readFile(
        path.resolve(process.cwd(), 'tsconfig.json'),
        'utf8'
      )
    );
    expect(config).toEqual({
      compilerOptions: {
        target: 'es3',
        module: 'none',
        noEmitOnError: true,
        outFile: './dummy.js',
        downlevelIteration: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        types: [
          'wsh',
          'windows-script-host',
          'activex-scripting',
          'activex-adodb',
        ],
        lib: ['ESNext'],
        typeRoots: [
          expect.stringMatching(/\/private-modules$/),
          expect.stringMatching(/\/private-modules\/@types$/),
        ],
      },
    });
    expect(await ((await fs.promises.stat(config.compilerOptions.typeRoots[0]))).isDirectory()).toBeTruthy();
    expect(await ((await fs.promises.stat(config.compilerOptions.typeRoots[1]))).isDirectory()).toBeTruthy();
  } finally {
    process.chdir(cwdsave);
  }
});

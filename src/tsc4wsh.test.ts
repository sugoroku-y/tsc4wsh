import * as fs from 'fs';
import * as path from 'path';
import {tsc4wsh, setOutput, setError} from './tsc4wsh';
import {generateTSConfig} from './transpile';

describe('tsc4wsh', () => {
  let stdoutText = '';
  let stderrText = '';

  beforeAll(() => {
    stdoutText = '';
    stderrText = '';
    setOutput({
      write(s: string) {
        stdoutText += s;
      },
      close() {},
    });
    setError({
      write(s: string) {
        stderrText += s;
      },
      close() {},
    });
  });
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
    const wsffile = `test/${filename}.wsf`;
    const expectwsffile = `test/expect/${filename}.wsf`;
    const expectoutfile = `test/expect/${filename}.out`;
    const expecterrfile = `test/expect/${filename}.err`;
    const existExpect = fs.existsSync(expectwsffile);
    const existOut = fs.existsSync(expectoutfile);
    const existErr = fs.existsSync(expecterrfile);
    if (fs.existsSync(wsffile)) {
      fs.unlinkSync(wsffile);
    }
    expect(await tsc4wsh([tsfile], {})).toBe(existExpect);
    if (existExpect) {
      expect(await fs.promises.readFile(wsffile, 'utf8')).toBe(
        await fs.promises.readFile(expectwsffile, 'utf8')
      );
    }
    if (existOut) {
      expect(stdoutText).toBe(
        await fs.promises.readFile(expectoutfile, 'utf8')
      );
      // } else if (stdoutText) {
      //   await fs.promises.writeFile(expectoutfile, stdoutText, 'utf8');
    }
    if (existErr) {
      expect(stderrText).toBe(
        await fs.promises.readFile(expecterrfile, 'utf8')
      );
      // } else if (stderrText) {
      //   await fs.promises.writeFile(expecterrfile, stderrText, 'utf8');
    }
  });
});

test('generateTSConfig', async () => {
  try {
    await fs.promises.mkdir('test/temp');
  } catch (ex) {
    if (ex.code !== 'EEXIST') {
      throw ex;
    }
  }
  const cwdsave = process.cwd();
  try {
    process.chdir('test/temp');
    generateTSConfig();
    expect(
      JSON.parse(
        await fs.promises.readFile(
          path.resolve(process.cwd(), 'tsconfig.json'),
          'utf8'
        )
      )
    ).toEqual({
      compilerOptions: {
        target: 'es3',
        module: 'none',
        noEmitOnError: true,
        outFile: './dummy.js',
        downlevelIteration: true,
        strict: true,
        strictNullChecks: true,
        types: ['windows-script-host', 'activex-scripting', 'activex-adodb'],
        lib: ['ESNext'],
        typeRoots: ['../../private-modules', '../../private-modules/@types'],
      },
    });
  } finally {
    process.chdir(cwdsave);
  }
});

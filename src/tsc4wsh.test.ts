/* global test, expect */
import * as fs from 'fs';
import * as path from 'path';
import {tsc4wsh, setOutput, setError} from './tsc4wsh';
import {generateTSConfig} from './transpile';

let stdoutText = '';
setOutput({
  write(s: string) {
    stdoutText += s;
  },
  close() {},
});
let stderrText = '';
setError({
  write(s: string) {
    stderrText += s;
  },
  close() {},
});

for (const name of [
  'delay-startup',
  'eval',
  'filever',
  'msiinfo',
  'test-reference',
  'test',
  'test-error',
]) {
  stdoutText = '';
  stderrText = '';
  const tsfile = `test/${name}.ts`;
  const wsffile = `test/${name}.wsf`;
  const expectwsffile = `test/expect/${name}.wsf`;
  const expectoutfile = `test/expect/${name}.out`;
  const expecterrfile = `test/expect/${name}.err`;
  const existExpect = fs.existsSync(expectwsffile);
  const existOut = fs.existsSync(expectoutfile);
  const existErr = fs.existsSync(expecterrfile);
  if (fs.existsSync(wsffile) && Math.random() < 0.5) {
    fs.unlinkSync(wsffile);
  }
  test(name, async () => {
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
}
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
        lib: ['es2018'],
        typeRoots: ['../../private-modules', '../../private-modules/@types'],
      },
    });
  } finally {
    process.chdir(cwdsave);
  }
});

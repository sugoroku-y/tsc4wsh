import * as fs from 'fs';
import * as path from 'path';
import { indented, isDirectory, mkdirEnsure, rmdirEnsure } from "./utils";

describe('mkdirEnsure', () => {
  test('not exist', async () => {
    // test/temp/tempが存在していれば削除
    await rmdirEnsure('test/temp/temp');
    // test/temp/temp/tempを作成
    await mkdirEnsure('test/temp/temp/temp');
  });
  test('file exists', async () => {
    expect(async () => await mkdirEnsure('test/test.ts')).rejects.toThrow();
  });
  test('directory exists', async () => {
    await mkdirEnsure('test/temp');
    await mkdirEnsure('test/temp');
  });
});

describe('rmdirEnsure', () => {
  test('not exist', async () => {
    const target = 'test/temp/not-exist';
    expect(await isDirectory(target)).toBe(false);
    await rmdirEnsure(target);
    expect(await isDirectory(target)).toBe(false);
  });
  test('includes file', async () => {
    const target = 'test/temp/includes-file';
    const file = path.join(target, 'file');
    await mkdirEnsure(target);
    expect(await isDirectory(target)).toBe(true);
    await fs.promises.writeFile(file, 'test', 'utf8');
    expect(await fs.promises.readFile(file, 'utf8')).toBe('test');
    await rmdirEnsure(target);
    expect(await isDirectory(target)).toBe(false);
  });
});

describe('indented', () => {
  test('standard', () => {
    expect(indented`
    aaa
    bbb
    ccc
    `).toBe('aaa\nbbb\nccc');
  });
  test('inserted', () => {
    expect(indented`
    aaa
    bbb
    ${'ddd'}
    ccc
    `).toBe('aaa\nbbb\nddd\nccc');
  });
  test('not indented', () => {
    expect(() => indented`${''}`).toThrow();
  });
  test('The first char is not a line feed.', () => {
    expect(() => indented`${''}
      `).toThrow();
  });
});

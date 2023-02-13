const escapes = {
  '\t': 't',
  '\r': 'r',
  '\n': 'n',
};
function toString(v: unknown): string {
  if (typeof v === 'string') {
    return `"${v.replace(/[\\""\t\n\r]/g, ch => '\\' + (escapes[ch as keyof typeof escapes] ?? ch))}"`;
  }
  if (isPrimitive(v)) {
    return String(v);
  }
  return `${Object.prototype.toString.call(v)}: ${JSON.stringify(v)}`;
}

function isPrimitive(o: unknown): o is undefined | null | boolean | number | string {
  return o === undefined || o === null || o === false || o === true || typeof o === 'number' || typeof o === 'string';
}

function isIterable(o: unknown): o is Iterable<unknown> {
  return typeof o === 'object' && o !== null && Symbol.iterator in o && typeof o[Symbol.iterator] === 'function';
}

/**
 * テスト用例外の基本クラス
 *
 * Error派生にするとinstanceofでの切り分けができなくなるので、
 * 新たに作成してError派生にはしない。
 */
class ErrorBase {
  readonly name;
  constructor(readonly message: string = '') {
    this.name = 'Error';
  }
  toString(): string {
    return `${this.name}: ${this.message}`;
  }
}

/** テストの失敗 */
class TestFailed extends ErrorBase {
  name = 'TestFailed';
}
/** テストコード自体に問題がある */
class IllegalTest extends ErrorBase {
  name = 'IllegalTest';
}

function sortedEntries(o: object): [string, unknown][] {
  return Object.entries(o).sort(([a], [b]) => (a === b ? 0 : a < b ? -1 : 1));
}

function equal(actual: unknown, expected: unknown): boolean {
  // Primitive型と関数は単純な比較
  if (isPrimitive(expected) || typeof expected === 'function') {
    return expected === actual;
  }
  // Iterable同士は順次要素を比較する
  if (isIterable(expected)) {
    if (!isIterable(actual)) {
      return false;
    }
    const iteratorA = actual[Symbol.iterator]();
    const iteratorE = expected[Symbol.iterator]();
    let a, e;
    while (((a = iteratorA.next()), (e = iteratorE.next()), !a.done && !e.done)) {
      if (!equal(a.value, e.value)) {
        return false;
      }
    }
    if (!a.done || !e.done) {
      return false;
    }
    return true;
  }
  // Objectは名前でソートしたentries同士を比較する
  return equal(sortedEntries(actual as object), sortedEntries(expected as object));
}

class TestResult<T> {
  constructor(private readonly actual: T) {}
  public toBe(expected: T): void {
    if (typeof this.actual === 'function') {
      throw new IllegalTest('Unsupported value type: function');
    }
    if (this.actual !== expected) {
      throw new TestFailed(`expected: ${toString(expected)}, but actual: ${toString(this.actual)}`);
    }
  }
  public toEqual(expected: T): void {
    if (typeof this.actual === 'function') {
      throw new IllegalTest('Unsupported value type: function');
    }
    if (!equal(this.actual, expected)) {
      throw new TestFailed(`expected: ${toString(expected)}, but actual: ${toString(this.actual)}`);
    }
  }
  public toThrow(): void;
  public toThrow(checker: (ex: unknown) => unknown): void;
  public toThrow(checker: RegExp): void;
  public toThrow(checker: string): void;
  public toThrow(checker?: ((ex: any) => unknown) | RegExp | string) {
    if (typeof this.actual !== 'function') {
      throw new IllegalTest('not thrown, because it is not function');
    }
    try {
      this.actual();
    } catch (ex) {
      if (!checker) {
        return;
      }
      if (typeof checker === 'function') {
        if (!checker(ex)) {
          throw new TestFailed(`The exception not passed the check: ${checker.toString()}`);
        }
        return;
      }
      const exString = String(
        (typeof ex === 'object' && ex && (('message' in ex && ex.message) || ('Message' in ex && ex.Message))) || ex,
      );
      if (checker instanceof RegExp) {
        if (!checker.test(exString)) {
          throw new TestFailed(`message not matched(${checker}): ${exString}`);
        }
        return;
      }
      if (typeof checker === 'string') {
        if (!exString.includes(checker)) {
          throw new TestFailed(`message not matched(${checker}): ${exString}`);
        }
        return;
      }
      throw new IllegalTest(`Unsupported checker type: ${typeof checker}: ${checker}`);
    }
    throw new TestFailed('No exception thrown');
  }
  public not = {
    toBe: (unexpected: T): void => {
      try {
        this.toBe(unexpected);
        throw new TestFailed(`unexpected value: ${toString(this.actual)}}`);
      } catch (ex) {
        if (ex instanceof TestFailed) {
          return;
        }
        throw ex;
      }
    },
    toEqual: (unexpected: T): void => {
      try {
        this.toEqual(unexpected);
        throw new TestFailed(`unexpected value: ${toString(this.actual)}}`);
      } catch (ex) {
        if (ex instanceof TestFailed) {
          return;
        }
        throw ex;
      }
    },
    toThrow: (checker?: ((ex: any) => unknown) | RegExp | string): void => {
      if (typeof this.actual !== 'function') {
        throw new IllegalTest('not thrown, because it is not function');
      }
      try {
        this.actual();
      } catch (ex) {
        const exString = String(
          (typeof ex === 'object' && ex && (('message' in ex && ex.message) || ('Message' in ex && ex.Message))) || ex,
        );
        if (!checker) {
          throw new TestFailed(`exception thrown: ${exString}`);
        }
        if (typeof checker === 'function') {
          if (checker(ex)) {
            throw new TestFailed(`The exception matched: ${checker.toString()}`);
          }
          return;
        }
        if (checker instanceof RegExp) {
          if (checker.test(exString)) {
            throw new TestFailed(`message matched(${checker}): ${exString}`);
          }
          return;
        }
        if (typeof checker === 'string') {
          if (exString.includes(checker)) {
            throw new TestFailed(`message matched(${checker}): ${exString}`);
          }
          return;
        }
        throw new IllegalTest(`Unsupported checker type: ${typeof checker}: ${checker}`);
      }
    },
  };
}

type TestCase = {description?: string; caption: string; testproc: () => unknown; result?: boolean};
const suite: TestCase[] = [];

let currentDescription: string | undefined;

function describe(caption: string, tests: () => unknown): void {
  const save = currentDescription;
  currentDescription = caption;
  try {
    tests();
  } finally {
    currentDescription = save;
  }
}

function test(caption: string, testproc: () => void): void {
  const description = currentDescription;
  const testcase = {
    description,
    caption,
    testproc,
  };
  testcase.toString = description ? () => `${description} ${caption}` : () => caption;
  suite.push(testcase);
}
namespace test {
  export function skip(caption: string, testproc: () => void): void {
    test(caption, testproc);
  }
}
const it = test;
function expect(v: number): TestResult<number>;
function expect(v: string): TestResult<string>;
function expect(v: boolean): TestResult<boolean>;
function expect<T>(v: Iterable<T>): TestResult<Iterable<T>>;
function expect(v: () => unknown): TestResult<() => unknown>;
function expect<T>(v: T): TestResult<T>;
function expect<T>(v: T): TestResult<T> {
  return new TestResult<T>(v);
}

// テストの実行
/* @onend */
/**
 * テストの実行
 * 自動的にスクリプトの最後に呼ばれる
 */
function wshtestRun() {
  const filter = WScript.Arguments.Unnamed.length
    ? new RegExp(
        Iterables.from(WScript.Arguments.Unnamed)
          .map(pattern => `(?:${pattern})`)
          .join('|'),
      )
    : undefined;
  const executeSuite = filter ? suite.filter(testcase => filter.test(String(testcase))) : suite;
  for (const testcase of executeSuite) {
    try {
      testcase.testproc.call(null);
      testcase.result = true;
    } catch (ex) {
      testcase.result = false;
      if (ex instanceof IllegalTest) {
        WScript.StdErr.WriteLine(`Illegal test: ${testcase}: ${ex.message}`);
        continue;
      }
      if (ex instanceof TestFailed) {
        WScript.StdErr.WriteLine(`FAILED: ${testcase}: ${ex.message}`);
        continue;
      }
      WScript.StdErr.WriteLine(
        `ERROR: ${testcase}: ${
          (((typeof ex === 'object' && ex) || typeof ex === 'function') &&
            (('message' in ex && ex.message) || ('Message' in ex && ex.Message))) ||
          ex
        }`,
      );
    }
  }
  const executed = suite.filter(({result}) => result !== undefined);
  const succeeded = executed.filter(({result}) => result);
  WScript.Echo(
    `Success: ${succeeded.length} / ${executed.length} : ${
      (((succeeded.length / executed.length) * 1000 + 0.5) | 0) / 10
    }%`,
  );
}

const escapes = {
  '\t': 't',
  '\r': 'r',
  '\n': 'n',
};
function toString(v: unknown): string {
  if (typeof v === 'string') {
    return `"${v.replace(
      /[\\""\t\n\r]/g,
      ch => '\\' + (escapes[ch as keyof typeof escapes] ?? ch)
    )}"`;
  }
  if (isPrimitive(v)) {
    return String(v);
  }
  return `${Object.prototype.toString.call(v)}: ${JSON.stringify(v)}`;
}

function isPrimitive(
  o: unknown
): o is undefined | null | boolean | number | string {
  return (
    o === undefined ||
    o === null ||
    o === false ||
    o === true ||
    typeof o === 'number' ||
    typeof o === 'string'
  );
}

function isIterable(o: unknown): o is Iterable<unknown> {
  return (
    typeof o === 'object' &&
    o !== null &&
    // @ts-ignore
    typeof o[Symbol.iterator] === 'function'
  );
}

class TestFailed extends Error {
  constructor(message: string) {
    super(message);
  }
}
class IllegalTest extends Error {
  constructor(message: string) {
    super(message);
  }
}

function arraytest<T>(actual: T[], expected: T[]): void {
  if (actual.length !== expected.length) {
    throw new TestFailed(
      `expected.length: ${expected.length}, but actual.length: ${actual.length}`
    );
  }
  for (let i = 0; i < actual.length; ++i) {
    if (actual[i] === expected[i]) {
      continue;
    }
    throw new TestFailed(
      `expected[${i}]: ${JSON.stringify(expected[i])}, but actual[${i}]: ${
        actual[i]
      }`
    );
  }
}

class TestResult<T> {
  constructor(private readonly actual: T) {}
  public toBe(expected: T): void {
    if (typeof this.actual === 'function') {
      throw new IllegalTest('Unsupported value type: function');
    }
    if (this.actual !== expected) {
      throw new TestFailed(
        `expected: ${toString(expected)}, but actual: ${toString(
          this.actual
        )}`
      );
    }
  }
  public toEqual(expected: T): void {
    if (typeof this.actual === 'function') {
      throw new IllegalTest('Unsupported value type: function');
    }
    if (isPrimitive(expected)) {
      this.toBe(expected);
      return;
    }
    if (Array.isArray(expected)) {
      if (!Array.isArray(this.actual)) {
        throw new TestFailed(
          `expected is an Array, but actual is not an Array: expected: ${toString(
            expected
          )}, actual:${toString(this.actual)}`
        );
      }
      arraytest(this.actual, expected);
      return;
    }
    if (isIterable(expected)) {
      if (!isIterable(this.actual)) {
        throw new TestFailed(
          `expected is an Iterable, but actual is not an Iterable: expected: ${toString(
            expected
          )}, actual:${toString(this.actual)}`
        );
      }
      arraytest([...this.actual], [...expected]);
      return;
    }
    if (typeof expected === 'object') {
      if (typeof this.actual !== 'object') {
        throw new TestFailed(`expected does not equal to actual: expected: ${toString(
            expected
          )}, actual:${toString(this.actual)}`)
        }
        const expectedKeys = Object.keys(expected);
        const actualKeys = Object.keys(this.actual);
        arraytest(actualKeys, expectedKeys);
      for (const key of actualKeys) {
          // @ts-ignore
          if (this.actual[key] !== expected[key]) {
            throw new TestFailed(`expected.${key} does not equal to actual.${key}: expected.${key}: ${toString(
              // @ts-ignore
              expected[key]
              )}, actual.${key}:${toString(
              // @ts-ignore
              this.actual[key]
            )}`)
        }
      }
      return;
    }
    throw new IllegalTest(`Unsupported type: expected: ${toString(expected)}`);
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
          throw new TestFailed(
            `The exception not passed the check: ${checker.toString()}`
          );
        }
        return;
      }
      const exString: string = String(
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
      throw new IllegalTest(
        `Unsupported checker type: ${typeof checker}: ${checker}`
      );
    }
    throw new TestFailed('No exception thrown');
  }
}
const tests: {[caption: string]: Array<() => void>} = {};
function test(caption: string, testproc: () => void): void {
  tests[caption] ??= [];
  tests[caption].push(testproc);
}
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
  const filter = new RegExp(
    Iterables.from(WScript.Arguments.Unnamed)
      .map(pattern => `(?:${pattern})`)
      .join('|')
  );
  let success = 0;
  let total = 0;
  for (const caption of Object.keys(tests)) {
    if (!(filter?.test(caption) ?? true)) {
      continue;
    }
    for (const test of tests[caption]) {
      ++total;
      try {
        test();
        ++success;
      } catch (ex) {
        if (ex instanceof IllegalTest) {
          WScript.StdErr.WriteLine(
            `Illegal test: ${caption}: ${ex.message ?? String(ex)}`
          );
        } else {
          WScript.StdErr.WriteLine(
            `FAILED: ${caption}: ${typeof ex === 'object' && ex && ('message' in ex && ex.message || 'Message' in ex && ex.Message) || ex}`,
          );
        }
      }
    }
  }
  WScript.Echo(
    `Success: ${success} / ${total} : ${
      (((success / total) * 1000 + 0.5) | 0) / 10
    }%`
  );
}

const escapes = {
  '\t': 't',
  '\r': 'r',
  '\n': 'n',
};
function toString(v: number | boolean | string | null | undefined): string {
  return typeof v === 'string'
    ? `"${v.replace(
        /[\\""\t\n\r]/g,
        ch => '\\' + (escapes[ch as keyof typeof escapes] ?? ch)
      )}"`
    : String(v);
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
class TestResult<T> {
  constructor(private readonly actual: T) {}
  public toBe(_expected: T): void {
    const expected = _expected as unknown;
    const actual = this.actual as unknown;
    if (
      actual === undefined ||
      actual === null ||
      typeof actual === 'number' ||
      typeof actual === 'string' ||
      typeof actual === 'boolean'
    ) {
      if (actual !== expected) {
        throw new TestFailed(
          `expected: ${toString(
            expected as typeof actual
          )}, but actual.length: ${toString(actual)}`
        );
      }
      return;
    } else if (typeof this.actual === 'function') {
      throw new IllegalTest('Unsupported value type: function');
    }
    if (
      typeof this.actual === 'object' &&
      typeof (this.actual as any)[Symbol.iterator] === 'function'
    ) {
      const a = [...((this.actual as any) as Iterable<any>)];
      const e = [...((expected as any) as Iterable<any>)];
      if (a.length !== e.length) {
        throw new TestFailed(
          `expected.length: ${e.length}, but actual.length: ${a.length}`
        );
      }
      for (let i = 0; i < a.length; ++i) {
        if (a[i] === e[i]) {
          continue;
        }
        throw new TestFailed(
          `expected[${i}]: ${JSON.stringify(e[i])}, but actual[${i}]: ${a[i]}`
        );
      }
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
          throw new TestFailed(
            `The exception not passed the check: ${checker.toString()}`
          );
        }
        return;
      }
      const exString: string =
        ex.message ?? ex.Message ?? ex.toString?.() ?? String(ex);
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
function expect<T>(v: () => any): TestResult<() => any>;
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
            `Illegal test: ${caption}: ${ex.message || String(ex)}`
          );
        } else {
          WScript.StdErr.WriteLine(
            `FAILED: ${caption}: ${ex.message || ex.Message || String(ex)}`
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

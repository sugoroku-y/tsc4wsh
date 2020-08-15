
function toString(v: number | boolean | string | null | undefined): string {
  return typeof v === 'string' ? '"' + v.replace(/[\\""]/g, '\\$&') : '' + v;
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
  public toBe(expected: T): void {
    if (
      !this.actual ||
      typeof this.actual === 'number' ||
      typeof this.actual === 'string' ||
      typeof this.actual === 'boolean'
    ) {
      if (this.actual !== expected) {
        throw new TestFailed(
          `expected: ${toString(
            expected as any
          )}, but actual.length: ${toString(this.actual as any)}`
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
  public toThrow(checker?: (ex: any) => boolean | RegExp) {
    ++total;
    if (typeof this.actual !== 'function') {
      throw new IllegalTest('not thrown, because it is not function');
    }
    try {
      this.actual();
    } catch (ex) {
      if (checker) {
        if (checker instanceof RegExp) {
          const exString = ex.message || ex.Message || ex.toString();
          if (!checker.test(exString)) {
            throw new TestFailed(`message not matched: ${exString}`);
          }
        } else if (typeof checker === 'function') {
          if (!checker(ex)) {
            throw new TestFailed(
              `The exception not passed the check: ${checker.toString()}`
            );
          }
        } else {
          throw new IllegalTest(
            `Unsupported checker: ${(checker as any).toString()}`
          );
        }
      }
      ++success;
      return;
    }
    throw new TestFailed('No exception thrown');
  }
}

let success = 0;
let total = 0;
function test(caption: string, testproc: () => void): void {
  ++total;
  try {
    testproc();
    ++success;
  } catch (ex) {
    if (ex instanceof TestFailed) {
      WScript.StdErr.WriteLine(
        `FAILED: ${caption}: ${ex.message || ex.toString()}`
      );
    } else {
      WScript.StdErr.WriteLine(
        `Illegal test: ${caption}: ${ex.message || ex.Message || ex.toString()}`
      );
    }
  }
}
function expect(v: number): TestResult<number>;
function expect(v: string): TestResult<string>;
function expect(v: boolean): TestResult<boolean>;
function expect<T>(v: Iterable<T>): TestResult<Iterable<T>>;
function expect<T>(v: () => any): TestResult<() => any>;
function expect<T>(v: T): TestResult<T> {
  return new TestResult<T>(v);
}

function teardown() {
  WScript.Echo(
    `Success: ${success} / ${total} : ${(((success / total) * 1000 + 0.5) | 0) /
      10}%`
  );
}

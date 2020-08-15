namespace Generator {
  // IterableIteratorは長いのでIIに省略
  type II<T> = IterableIterator<T>;

  class Generator<T> implements IterableIterator<T> {
    constructor(private readonly i: IterableIterator<T>) {}
    next() {
      return this.i.next();
    }
    [Symbol.iterator]() {
      return this.i;
    }
    forEach(callback: (value: T, index: number) => any) {
      forEach(this.i, callback);
    }
    some(callback: (value: T, index: number) => boolean) {
      return some(this.i, callback);
    }
    every(callback: (value: T, index: number) => boolean) {
      return every(this.i, callback);
    }
    filter<S extends T>(
      callback: (value: T, index: number) => value is S
    ): Generator<S>;
    filter(callback: (value: T, index: number) => any): Generator<T>;
    filter(callback: (value: T, index: number) => any) {
      return filter(this.i, callback);
    }
    map<T2>(callback: (value: T, index: number) => T2) {
      return map(this.i, callback);
    }
    reduce(callback: (result: T, element: T, index: number) => T): T;
    reduce<T2>(
      callback: (result: T2, element: T, index: number) => T2,
      initialValue: T2
    ): T2;
    reduce<T2>(
      ...args: [(result: T2, element: T, index: number) => T2, T2?]
    ): T2 {
      return reduce(this.i, ...(args as [typeof args[0], T2]));
    }
    join(separator: string) {
      return join(this.i, separator);
    }
  }

  export function forEach<T>(
    ii: II<T>,
    callback: (value: T, index: number) => any
  ): void {
    let index = 0;
    for (const e of ii) {
      callback(e, index++);
    }
  }
  export function some<T>(
    ii: II<T>,
    callback: (value: T, index: number) => boolean
  ): boolean {
    let index = 0;
    for (const e of ii) {
      if (callback(e, index++)) return true;
    }
    return false;
  }
  export function every<T>(
    ii: II<T>,
    callback: (value: T, index: number) => boolean
  ): boolean {
    let index = 0;
    for (const e of ii) {
      if (!callback(e, index++)) return false;
    }
    return true;
  }
  export function filter<T, S extends T>(
    ii: II<T>,
    callback: (value: T, index: number) => value is S
  ): Generator<S>;
  export function filter<T>(
    ii: II<T>,
    callback: (value: T, index: number) => any
  ): Generator<T>;
  export function filter<T>(
    ii: II<T>,
    callback: (value: T, index: number) => any
  ) {
    return new Generator(
      (function*() {
        let index = 0;
        for (const e of ii) {
          if (callback(e, index++)) {
            yield e;
          }
        }
      })()
    );
  }
  export function map<T, T2>(
    ii: II<T>,
    callback: (value: T, index: number) => T2
  ) {
    return new Generator(
      (function*() {
        let index = 0;
        for (const e of ii) {
          yield callback(e, index++);
        }
      })()
    );
  }
  export function reduce<T>(
    ii: II<T>,
    callback: (r: T, e: T, index: number) => T
  ): T;
  export function reduce<T, T2>(
    ii: II<T>,
    callback: (r: T2, e: T, index: number) => T2,
    initialValue: T2
  ): T2;
  export function reduce<T, T2>(
    ii: II<T>,
    callback: (r: T2, e: T, index: number) => T2,
    initialValue?: T2
  ) {
    let index = 0;
    let ir = ii.next();
    let result: T2;
    if (arguments.length <= 2) {
      if (ir.done) throw new Error('empty');
      result = ir.value as any;
      ir = ii.next();
      ++index;
    } else {
      result = initialValue as any;
    }
    while (!ir.done) {
      result = callback(result, ir.value, index++);
      ir = ii.next();
    }
    return result;
  }
  export function join<T>(ii: II<T>, separator: string): string {
    return map(ii, e => e.toString()).reduce(
      (result, current, i) =>
        i === 0 ? current : result + separator + current,
      ''
    );
  }

  export function concat<T extends II<any>[]>(
    ...generators: T
  ): Generator<T extends II<infer R>[] ? R : never> {
    return new Generator(
      (function*() {
        for (const generator of generators) {
          yield* generator;
        }
      })()
    );
  }

  //type EnumeratorType<T> = EnumeratorConstructor extends (new(c: T) => Enumerator<infer R>) ? R : never;
  type EnumeratorType<T> = T extends {Item(index: any): infer R}
    ? R
    : T extends {item(index: any): infer R}
    ? R
    : T extends Scripting.Dictionary<infer R>
    ? R
    : never;

  export function from<T>(collection: T[]): Generator<T>;
  export function from<T>(collection: T): Generator<EnumeratorType<T>>;
  export function from(collection: any) {
    if (Array.isArray(collection)) {
      return new Generator(
        (function*() {
          yield* collection;
        })()
      );
    }
    const e = new Function(
      'try {return new Enumerator(arguments[0]);}catch(ex){return null;}'
    )(collection);
    if (e) {
      return new Generator(
        (function*() {
          for (; !e.atEnd(); e.moveNext()) {
            yield e.item();
          }
        })()
      );
    }
    throw new Error('Unsupported collection type: ' + typeof collection);
  }

  export function of<T>(): IterableIterator<T extends any[] ? never : T>;
  export function of<T extends any[]>(
    ...args: T
  ): IterableIterator<T extends (infer R)[] ? R : never>;
  export function of<T extends any[]>(...args: T) {
    return new Generator<any>(
      (function*() {
        yield* args;
      })()
    );
  }
}

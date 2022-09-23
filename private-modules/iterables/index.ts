interface X<T> {
  [Symbol.iterator](): Iterator<T>;
}
function x<T>(a: X<T> | (() => X<T>)) {
  if (typeof a === 'function') {
    a = a();
    a;
  } else {
    a;
  }
  a;
}


namespace Iterables {
  // Iterableは長いのでIに省略
  type I<T> = Iterable<T>;
  // IterableExも同様にGに省略
  type Ex<T> = IterableEx<T>;
  // Iterableの型パラメータ
  type IType<II> = II extends I<infer R> ? R : never;

  /**
   * Iterables のメソッドをメンバに持つIterable。
   *
   * @class IterableEx
   * @implements {I<T>}
   * @template T
   */
  class IterableEx<T> implements I<T> {
    readonly [Symbol.iterator]!: () => Iterator<T>;
    constructor(param: I<T> | (() => I<T>)) {
      const p = typeof param === 'function' ? param() : param;
      this[Symbol.iterator] = () => p[Symbol.iterator]();
    }
    public forEach(callback: (e: T, i: number, x: this) => unknown) {
      forEach(this, callback);
    }
    public some(callback: (e: T, i: number, x: this) => unknown) {
      return some(this, callback);
    }
    public every(callback: (e: T, i: number, x: this) => unknown) {
      return every(this, callback);
    }
    public filter<S extends T>(
      callback: (e: T, i: number, x: this) => e is S
    ): Ex<S>;
    public filter(callback: (e: T, i: number, x: this) => any): Ex<T>;
    public filter(callback: (e: T, i: number, x: this) => any) {
      return filter(this, callback);
    }
    public map<S>(callback: (e: T, i: number, x: this) => S) {
      return map(this, callback);
    }
    public reduce(callback: (r: T, e: T, i: number, x: this) => T): T;
    public reduce<S>(
      callback: (r: S, e: T, i: number, x: this) => S,
      initialValue: S
    ): S;
    public reduce<S>(...args: [(r: S, e: T, i: number, x: this) => S, S?]): S {
      return reduce(this, ...(args as Required<typeof args>));
    }
    public join(sep?: string) {
      return join(this, sep);
    }
    public concat<ARGS extends Iterable<unknown>[]>(
      ...args: ARGS
    ): Ex<[this, ...ARGS] extends I<infer R>[] ? R : never> {
      return concat(this, ...args);
    }
  }

  /**
   * Iterableの返す各要素に対してコールバックを呼び出す。
   * @export
   * @template T 引数で指定したIterableが返す要素の型を指定する。
   * @template X 引数で指定したIterableの実際の型を指定する。
   * @param {X} x コールバックを呼び出す要素を返すIterableを指定する。
   * @param {(e: T, i: number, x: X) => any} callback 引数で指定したIterableの各要素を渡して呼び出すコールバックを指定する。
   */
  export function forEach<X extends I<unknown>, T extends IType<X>>(
    x: X,
    callback: (e: T, i: number, x: X) => unknown
  ): void {
    let i = 0;
    for (const e of x as I<T>) {
      callback(e, i++, x);
    }
  }
  /**
   * Iterableの返す各要素に対してコールバックを呼び出し、一つでもtruthyな値を返すものがあればtrueを返す。
   *
   * truthyな値を返す要素が見つかった時点で各要素へのコールバックの呼び出しを中断する。
   *
   * @export
   * @template T 引数で指定したIterableが返す要素の型を指定する。
   * @template X 引数で指定したIterableの実際の型を指定する。
   * @param {X} x コールバックを呼び出す要素を返すIterableを指定する。
   * @param {(e: T, i: number, x: X) => boolean} callback 引数で指定したIterableの各要素を渡して呼び出すコールバックを指定する。
   * @returns {boolean} Iterableの返す各要素に対してコールバックを呼び出し、一つでもtruthyな値を返すものがあればtrueを返す。いずれの要素もfalsyな値を返した場合はfalseを返す。
   */
  export function some<X extends I<unknown>, T extends IType<X>>(
    x: X,
    callback: (e: T, i: number, x: X) => unknown
  ): boolean {
    let i = 0;
    for (const e of x as I<T>) {
      if (callback(e, i++, x)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Iterableの返す各要素に対してコールバックを呼び出し、一つでもfalsyな値を返すものがあればfalseを返す。
   *
   * falsyな値を返す要素が見つかった時点で各要素へのコールバックの呼び出しを中断する。
   *
   * @export
   * @template T 引数で指定したIterableが返す要素の型を指定する。
   * @template X 引数で指定したIterableの実際の型を指定する。
   * @param {X} x コールバックを呼び出す要素を返すIterableを指定する。
   * @param {(e: T, i: number, x: X) => boolean} callback 引数で指定したIterableの各要素を渡して呼び出すコールバックを指定する。
   * @returns {boolean} Iterableの返す各要素に対してコールバックを呼び出し、一つでもfalsyな値を返すものがあればfalseを返す。いずれの要素もtruthyな値を返した場合はtrueを返す。
   */
  export function every<X extends I<unknown>, T extends IType<X>>(
    x: X,
    callback: (e: T, i: number, x: X) => unknown
  ): boolean {
    let i = 0;
    for (const e of x as I<T>) {
      if (!callback(e, i++, x)) {
        return false;
      }
    }
    return true;
  }
  /**
   * Iterableの返す各要素に対してコールバックを呼び出し、truthyな値を返した要素のみを返すIterableExを生成する。
   *
   * @export
   * @template T 引数で指定したIterableが返す要素の型を指定する。
   * @template S この関数が返すIterableExの要素の型を指定する
   * @template X 引数で指定したIterableの実際の型を指定する。
   * @param {X} x コールバックを呼び出す要素を返すIterableを指定する。
   * @param {(e: T, i: number, x: X) => e is S} callback 引数で指定したIterableの各要素を渡して呼び出すコールバックを指定する。
   * @returns {IterableEx<S>} Iterableの返す各要素に対してコールバックを呼び出し、truthyな値を返した要素のみを返すIterableExを生成して返す。
   */
  export function filter<X extends I<unknown>, T extends IType<X>, S extends T>(
    x: X,
    callback: (e: T, i: number, x: X) => e is S
  ): Ex<S>;
  /**
   * Iterableの返す各要素に対してコールバックを呼び出し、truthyな値を返した要素のみを返すIterableExを生成する。
   *
   * @export
   * @template T 引数で指定したIterableが返す要素の型を指定する。
   * @template X 引数で指定したIterableの実際の型を指定する。
   * @param {X} x コールバックを呼び出す要素を返すIterableを指定する。
   * @param {(e: T, i: number, x: X) => any} callback 引数で指定したIterableの各要素を渡して呼び出すコールバックを指定する。
   * @returns {IterableEx<T>} Iterableの返す各要素に対してコールバックを呼び出し、truthyな値を返した要素のみを返すIterableExを生成して返す。
   */
  export function filter<X extends I<unknown>, T extends IType<X>>(
    x: X,
    callback: (e: T, i: number, x: X) => unknown
  ): Ex<T>;
  export function filter<X extends I<unknown>, T extends IType<X>>(
    x: X,
    callback: (e: T, i: number, x: X) => unknown
  ): Ex<T> {
    return new IterableEx<T>(function* () {
      let i = 0;
      for (const e of x as I<T>) {
        if (callback(e, i++, x)) {
          yield e as T;
        }
      }
    });
  }
  /**
   * Iterableの返す各要素に対してコールバックを呼び出し、コールバックの返す値を要素とするIterableExを生成する。
   *
   * @export
   * @template T 引数で指定したIterableが返す要素の型を指定する。
   * @template X 引数で指定したIterableの実際の型を指定する。
   * @template S この関数が返すIterableExの要素の型を指定する。
   * @param {X} x コールバックを呼び出す要素を返すIterableを指定する。
   * @param {(e: T, i: number, x: X) => S} callback 引数で指定したIterableの各要素を渡して呼び出すコールバックを指定する。
   * @returns {IterableEx<T>} Iterableの返す各要素に対してコールバックを呼び出し、コールバックの返す値を要素とするIterableExを生成して返す。
   */
  export function map<X extends I<unknown>, T extends IType<X>, S>(
    x: X,
    callback: (e: T, i: number, x: X) => S
  ) {
    return new IterableEx(function* () {
      let i = 0;
      for (const e of x as I<T>) {
        yield callback(e, i++, x);
      }
    });
  }
  /**
   * Iterableの返す各要素に対してコールバックを呼び出し、最終的なコールバックの返す値を返す。
   *
   * コールバックの最初の呼び出しはIterableExが最初に返す値を第1引数、2番目に返す値を第2引数として呼び出し、第3引数は1から始まる。
   * @export
   * @template T 引数で指定したIterableが返す要素の型を指定する。
   * @template X 引数で指定したIterableの実際の型を指定する。
   * @param {X} x コールバックを呼び出す要素を返すIterableを指定する。
   * @param {(r: T, e: T, i: number, x: X) => T} callback 引数で指定したIterableの各要素を渡して呼び出すコールバックを指定する。
   * @returns {T} 最後に呼び出されたコールバックの返値を返す。
   */
  export function reduce<X extends I<unknown>, T extends IType<X>>(
    x: X,
    callback: (r: T, e: T, i: number, x: X) => T
  ): T;
  /**
   * Iterableの返す各要素に対してコールバックを呼び出し、最終的なコールバックの返す値を返す。
   *
   * コールバックの最初の呼び出しはinitialValueを第1引数、IterableExが最初に返す値を第2引数として呼び出し、第3引数は0から始まる。
   * @export
   * @template T 引数で指定したIterableが返す要素の型を指定する。
   * @template S この関数が返す型を指定する。
   * @template X 引数で指定したIterableの実際の型を指定する。
   * @param {X} x コールバックを呼び出す要素を返すIterableを指定する。
   * @param {(r: S, e: T, i: number, x: X) => S} callback  引数で指定したIterableの各要素を渡して呼び出すコールバックを指定する。
   * @param {S} initialValue コールバックの第1引数として最初に渡される値を指定する。
   * @returns {S} 最後に呼び出されたコールバックの返値を返す。
   */
  export function reduce<X extends I<unknown>, T extends IType<X>, S>(
    x: X,
    callback: (r: S, e: T, i: number, x: X) => S,
    initialValue: S
  ): S;
  export function reduce<X extends I<unknown>, T extends IType<X>, S>(
    x: X,
    callback: (r: S, e: T, i: number, x: X) => S,
    initialValue?: S
  ) {
    let iterable = x as I<T>;
    let initialIndex = 0;
    if (arguments.length <= 2) {
      const itr = iterable[Symbol.iterator]();
      const ir = itr.next();
      if (ir.done) {
        throw new Error('Reduce of empty Iterable with no initial value');
      }
      initialIndex = 1;
      iterable = {
        [Symbol.iterator]() {
          return itr;
        },
      };
      initialValue = ir.value as unknown as S; // arguments.length <= 2 なら ir.value is S(=T)
    }
    let r: S = initialValue!; // arguments.length > 2 なら initialValue is S(not nullish)
    let i = initialIndex;
    for (const e of iterable) {
      r = callback(r, e, i++, x);
    }
    return r;
  }
  /**
   * Iterableの返す各要素を文字列に変換し、結合する。
   *
   * @export
   * @template T 引数で指定したIterableが返す要素の型を指定する。
   * @template X 引数で指定したIterableの実際の型を指定する。
   * @param {X} x コールバックを呼び出す要素を返すIterableを指定する。
   * @param {string} sep 結合する際に各要素間に挿入する文字列を指定する。
   * @returns {string} Iterableの返す各要素を文字列に変換し、結合した文字列を返す。
   */
  export function join<T>(x: I<T>, sep?: string): string {
    sep ??= ',';
    const itr = x[Symbol.iterator]();
    let {value, done} = itr.next();
    if (done) {
      return '';
    }
    let result = String(value);
    while ((({value, done} = itr.next()), !done)) {
      result += sep;
      result += String(value);
    }
    return result;
  }

  /**
   * 引数に指定した全てのIterableを結合したIterableExを生成する。
   *
   * @export
   * @template T 全引数の型を指定する。
   * @param {...T} generators Iterableの配列を指定する
   * @returns {Ex<T extends Array<I<infer R>> ? R : never>} 引数に指定した全てのIterableを結合したIterableExを生成して返す。
   */
  export function concat<T extends Array<I<any>>>(
    ...generators: T
  ): Ex<T extends Array<I<infer R>> ? R : never> {
    return new IterableEx(function* () {
      for (const generator of generators) {
        yield* generator;
      }
    });
  }

  // type EnumeratorType<T> = EnumeratorConstructor extends {new (col: T): Enumerator<infer R>} ? R : never;
  // ↑ではうまくいかない(Tに何入れてもunknownになる)
  type EnumeratorType<T> =
    // SafeArrayにはItemメソッドがないので特別扱い
    T extends SafeArray<infer R>
          ? R
      : // Scripting.DictionaryにはItemメソッドがあるがEnumeratorが返すのはKeyの値なので特別扱い
      T extends Scripting.Dictionary<infer R, unknown>
      ? R
      : // Item/itemメソッドがあればその返値の型
      T extends {Item(index: any): infer R}
          ? R
      : T extends {item(index: any): infer R}
          ? R
          : never;

  function isIterable(collection: any): collection is I<any> {
    return typeof collection[Symbol.iterator] === 'function';
  }

  /**
   * 配列、Iterable、IterableExをIterableExに変換する。
   *
   * @export
   * @template T 生成するIterableExの要素の型を指定する。
   * @param {(T[] | Iterable<T> | IterableEx<T>)} collection IterableExの元になるコレクションを指定する。
   * @returns {IterableEx<T>} collectionから生成されたIterableExを返す。
   */
  export function from<T>(collection: T[] | I<T> | Ex<T>): Ex<T>;
  /**
   * Enumeratorのコンストラクタに指定できるものをIterableExに変換する。
   *
   * @export
   * @template T 生成するIterableExの要素の型を指定する。
   * @param {(T[] | Iterable<T> | IterableEx<T>)} collection IterableExの元になるコレクションを指定する。
   * @returns {IterableEx<T>} collectionから生成されたIterableExを返す。
   */
  export function from<X, T extends EnumeratorType<X>>(collection: X): Ex<T>;
  export function from(collection: any) {
    // もともとIterableExの場合はそのまま返す
    if (isIterableEx(collection)) {
      return collection;
    }
    return new IterableEx(
      // Iterableの場合はIterableExのコンストラクタに引数として渡す
      isIterable(collection)
        ? collection
        : // それ以外はEnumeratorを生成してみてコンストラクタに引数として渡す
          function* () {
            for (
              
              
              const e = new Enumerator(collection as any);
        
        
                        !e.atEnd();
          
          
                    e.moveNext()
            
            
            ) {
              yield e.item();
            }
          }
    );
  }

  /**
   * 指定の型の空のIterableExを生成する。
   * @export
   * @template T IterableExが返す要素の型を指定する。省略時はany。
   * @returns {IterableEx<T extends any[] ? never : T>} 空のIterableExを返す。
   */
  export function of<T = never>(): Ex<T>;
  /**
   * 引数に渡された値をそのまま返すIterableExを生成する。
   * @export
   * @template T IterableExが返す要素の配列型を指定する。
   * @param {...T} args IterableExが返す要素を指定する。
   * @returns {Ex<T extends Array<infer R> ? R : never>} 引数に渡された値をそのまま返すIterableExを返す。
   */
  export function of<T extends any[]>(
    ...args: T
  ): Ex<T extends Array<infer R> ? R : never>;
  export function of<T extends any[]>(...args: T) {
    return from(args);
  }

  export function max<T>(itr: Iterable<T>): T {
    return reduce(itr, (mx, e) => (mx < e ? e : mx));
  }
  export function min<T>(itr: Iterable<T>): T {
    return reduce(itr, (mn, e) => (mn > e ? e : mn));
  }

  /**
   * IterableExかどうかを判別する
   * @export
   * @param {*} x IterableExかどうかを判別するオブジェクト
   * @returns {x is IterableEx<any>} gがIterableExであれば真を返す。
   */
  function isIterableEx(x: any): x is IterableEx<any> {
    return x && x instanceof IterableEx;
  }
}

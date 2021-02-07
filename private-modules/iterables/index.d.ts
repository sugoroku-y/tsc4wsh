/// <reference types="../iterables" />
/// <reference types="activex-scripting" />
declare namespace Iterables {
    type I<T> = Iterable<T>;
    type Ex<T> = IterableEx<T>;
    /**
     * Iterables のメソッドをメンバに持つIterable。
     *
     * @class IterableEx
     * @implements {I<T>}
     * @template T
     */
    class IterableEx<T> implements I<T> {
        private readonly i;
        constructor(param: I<T> | (() => IterableIterator<T>));
        [Symbol.iterator](): Iterator<T, any, undefined>;
        forEach(callback: (e: T, i: number, x: Ex<T>) => any): void;
        some(callback: (e: T, i: number, x: Ex<T>) => boolean): boolean;
        every(callback: (e: T, i: number, x: Ex<T>) => boolean): boolean;
        filter<S extends T>(callback: (e: T, i: number, x: Ex<T>) => e is S): Ex<S>;
        filter(callback: (e: T, i: number, x: Ex<T>) => any): Ex<T>;
        map<S>(callback: (e: T, i: number, x: I<T>) => S): IterableEx<S>;
        reduce(callback: (r: T, e: T, i: number, x: Ex<T>) => T): T;
        reduce<S>(callback: (r: S, e: T, i: number, ie: Ex<T>) => S, initialValue: S): S;
        join(sep: string): string;
    }
    /**
     * Iterableの返す各要素に対してコールバックを呼び出す。
     * @export
     * @template T 引数で指定したIterableが返す要素の型を指定する。
     * @template X 引数で指定したIterableの実際の型を指定する。
     * @param {X} x コールバックを呼び出す要素を返すIterableを指定する。
     * @param {(e: T, i: number, x: X) => any} callback 引数で指定したIterableの各要素を渡して呼び出すコールバックを指定する。
     */
    export function forEach<T, X extends I<T>>(x: I<T>, callback: (e: T, i: number, x: X) => any): void;
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
    export function some<T, X extends I<T>>(x: I<T>, callback: (e: T, i: number, x: X) => boolean): boolean;
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
    export function every<T, X extends I<T>>(x: I<T>, callback: (e: T, i: number, x: X) => boolean): boolean;
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
    export function filter<T, S extends T, X extends I<T>>(x: I<T>, callback: (e: T, i: number, x: X) => e is S): Ex<S>;
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
    export function filter<T, X extends I<T>>(x: I<T>, callback: (e: T, i: number, x: X) => any): Ex<T>;
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
    export function map<T, X extends I<T>, S>(x: I<T>, callback: (e: T, i: number, x: X) => S): IterableEx<S>;
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
    export function reduce<T, X extends I<T>>(x: I<T>, callback: (r: T, e: T, i: number, x: X) => T): T;
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
    export function reduce<T, S, X extends I<T>>(x: I<T>, callback: (r: S, e: T, i: number, x: X) => S, initialValue: S): S;
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
    export function join<T extends {
        toString(): string;
    }, X extends I<T>>(x: I<T>, sep: string): string;
    /**
     * 引数に指定した全てのIterableを結合したIterableExを生成する。
     *
     * @export
     * @template T 全引数の型を指定する。
     * @param {...T} generators Iterableの配列を指定する
     * @returns {Ex<T extends Array<I<infer R>> ? R : never>} 引数に指定した全てのIterableを結合したIterableExを生成して返す。
     */
    export function concat<T extends Array<I<any>>>(...generators: T): Ex<T extends Array<I<infer R>> ? R : never>;
    type EnumeratorType<T> = T extends {
        Item(index: any): infer R;
    } ? R : T extends {
        item(index: any): infer R;
    } ? R : T extends Scripting.Dictionary<infer R> ? R : never;
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
    export function from<T>(collection: T): Ex<EnumeratorType<T>>;
    /**
     * 指定の型の空のIterableExを生成する。
     * @export
     * @template T IterableExが返す要素の型を指定する。省略時はany。
     * @returns {IterableEx<T extends any[] ? never : T>} 空のIterableExを返す。
     */
    export function of<T = any>(): Ex<T>;
    /**
     * 引数に渡された値をそのまま返すIterableExを生成する。
     * @export
     * @template T IterableExが返す要素の配列型を指定する。
     * @param {...T} args IterableExが返す要素を指定する。
     * @returns {Ex<T extends Array<infer R> ? R : never>} 引数に渡された値をそのまま返すIterableExを返す。
     */
    export function of<T extends any[]>(...args: T): Ex<T extends Array<infer R> ? R : never>;
    export function max<T>(itr: Iterable<T>): T;
    export function min<T>(itr: Iterable<T>): T;
    export {};
}

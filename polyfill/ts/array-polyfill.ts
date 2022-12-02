(function () {
  Array.isArray ??= function isArray(obj: unknown): obj is unknown[] {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };
  Array.of ??= function of<T>(..._: T[]): T[] {
    return Array.prototype.slice.call(arguments);
  };
  Array.from ??= function from<T, R, THIS>(
    arrayLike: { length: number; [index: number]: T },
    mapFn?: (this: THIS, e: T, i: number) => R,
    thisArg?: THIS
  ): R[] {
    if (
      typeof mapFn !== "function" &&
      Object.prototype.toString.call(mapFn) !== "[object Function]"
    ) {
      mapFn = (e) => e;
    }
    // もともとarrayLikeが配列ならmapを呼ぶだけ
    if (Array.isArray(arrayLike)) {
      return arrayLike.map(mapFn, thisArg);
    }
    // Enumeratorが使えるなら使って配列化
    if (
      typeof arrayLike === "object" &&
      (typeof arrayLike.Item === "function" ||
        typeof arrayLike.item === "function")
    ) {
      const array = [];
      let i = 0;
      for (const e = new Enumerator(arrayLike); !e.atEnd(); e.moveNext()) {
        array.push(mapFn.call(thisArg, e.item(), i++));
      }
      return array;
    }
    const length = +arrayLike.length || 0;
    const array = [];
    for (let i = 0; i < length; ++i) {
      array[i] = mapFn.call(thisArg, arrayLike[i], i);
    }
    return array;
  };

  Array.prototype.some ??= function some<T, THIS>(
    this: T[],
    callback: (this: THIS, e: T, i: number, a: T[]) => unknown,
    thisObj?: THIS
  ): boolean {
    for (let i = 0; i < this.length; ++i) {
      if (!(i in this)) {
        continue;
      }
      if (callback.call(thisObj, this[i], i, this)) {
        return true;
      }
    }
    return false;
  };
  Array.prototype.every ??= function every<T, THIS>(
    this: T[],
    callback: (this: THIS, e: T, i: number, a: T[]) => unknown,
    thisObj?: THIS
  ) {
    for (let i = 0; i < this.length; ++i) {
      if (!(i in this)) {
        continue;
      }
      if (!callback.call(thisObj, this[i], i, this)) {
        return false;
      }
    }
    return true;
  };

  Array.prototype.reduce ??= function reduce<T, R>(
    this: T[],
    callback: (r: R, e: T, i: number, a: T[]) => R,
    initialValue: R
  ): R {
    let index = 0;
    let result = 1 < arguments.length ? initialValue : (this[index++] as unknown as R);
    for (; index < this.length; ++index) {
      if (!(index in this)) {
        continue;
      }
      result = callback.call(null, result, this[index], index, this);
    }
    return result;
  };
  Array.prototype.reduceRight ??= function reduceRight<T, R>(
    this: T[],
    callback: (r: R, e: T, i: number, a: T[]) => R,
    initialValue: R
  ): R {
    let index = this.length;
    let result = 1 < arguments.length ? initialValue : (this[--index] as unknown as R);
    while (index-- > 0) {
      if (!(index in this)) {
        continue;
      }
      result = callback.call(null, result, this[index], index, this);
    }
    return result;
  };
  Array.prototype.forEach ??= function forEach<T, THIS>(
    this: T[],
    callback: (this: THIS, e: T, i: number, a: T[]) => unknown,
    thisObj: THIS
  ) {
    for (let index = 0; index < this.length; ++index) {
      if (!(index in this)) {
        continue;
      }
      callback.call(thisObj, this[index], index, this);
    }
  };
  Array.prototype.filter ??= function filter<T, THIS>(
    this: T[],
    callback: (e: T, i: number, a: T[]) => unknown,
    thisObj: THIS
  ) {
    const result = [];
    for (let index = 0; index < this.length; ++index) {
      if (!(index in this)) {
        continue;
      }
      const element = this[index];
      if (callback.call(thisObj, element, index, this)) {
        result.push(element);
      }
    }
    return result;
  };
  Array.prototype.map ??= function map<T, R, THIS>(
    this: T[],
    callback: (this: THIS, e: T, i: number, a: T[]) => R,
    thisObj: any
  ): R[] {
    const result: R[] = [];
    for (let index = 0; index < this.length; ++index) {
      if (!(index in this)) {
        continue;
      }
      result[index] = callback.call(thisObj, this[index], index, this);
    }
    return result;
  };

  /**
   * 引数で渡されるインデックスを調整する。
   * 
   * - 引数が指定されていなければデフォルト値。デフォルト値が省略されているときに引数が指定されていなければエラー。
   * - 負の数が指定されたら、最後から絶対値分遡ったインデックス。
   * - (上記の調整後)指定のインデックスが0未満なら0，lengthより大きければlengthに補正。
   * @param this 呼び出し元のインスタンス
   * @param args 関数に渡される引数
   * @param index 取得する引数のインデックス
   * @param defaultValue 引数が省略されたときのデフォルト値
   * @returns 調整後のインデックス
   */
  function adjustIndex(
    this: unknown[],
    args: IArguments,
    index: number,
    defaultValue?: number
  ) {
    if (index >= args.length) {
      if (defaultValue === undefined) {
        throw new Error("arguments[" + index + "] required");
      }
      return defaultValue;
    }
    let value = +args[index];
    if (value < 0) {
      value += this.length;
    }
    if (value < 0) {
      value = 0;
    } else if (value > length) {
      value = this.length;
    }
    return value;
  }
  Array.prototype.copyWithin ??= function copyWithin<T>(
    this: T[],
    target: number,
    start?: number,
    end?: number
  ): T[] {
    const target = adjustIndex.call(this, arguments, 0);
    const start = adjustIndex.call(this, arguments, 1, 0);
    const end = adjustIndex.call(this, arguments, 2, this.length);
    const source = this.slice(start, end);
    const length = Math.min(source.length, this.length - target);
    for (let i = target; i < length; ++i) {
      if (i in source) {
        this[target + i] = source[i];
      } else {
        delete this[target + i];
      }
    }
    return this;
  };
  Array.prototype.fill ??= function fill<T>(
    this: T[],
    value: T,
    start?: number,
    end?: number
  ): T[] {
    const start = adjustIndex.call(this, arguments, 1, 0);
    const end = adjustIndex.call(this, arguments, 2, this.length);
    for (let i = start; i < end; ++i) {
      this[i] = value;
    }
    return this;
  };
  Array.prototype.find ??= function find<T, THIS>(
    this: T[],
    pred: (this: THIS, e: T, i: number, a: T[]) => unknown,
    thisArg: THIS
  ): T | undefined {
    for (let i = 0; i < this.length; ++i) {
      if (!(i in this)) {
        continue;
      }
      const e = this[i];
      if (pred.call(thisArg, e, i, this)) {
        return e;
      }
    }
    return undefined;
  };
  Array.prototype.findIndex ??= function findIndex<T, THIS>(
    this: T[],
    pred: (this: THIS, e: T, i: number, a: T[]) => unknown,
    thisArg: THIS
  ): number {
    for (let i = 0; i < this.length; ++i) {
      if (!(i in this)) {
        continue;
      }
      const e = this[i];
      if (pred.call(thisArg, e, i, this)) {
        return i;
      }
    }
    return -1;
  };
  Array.prototype.includes ??= function includes<T>(
    this: T[],
    searchElement: T
  ): boolean {
    for (let i = 0; i < this.length; ++i) {
      if (!(i in this)) {
        continue;
      }
      if (this[i] === searchElement) {
        return true;
      }
    }
    return false;
  };
  Array.prototype.indexOf ??= function indexOf<T>(
    this: T[],
    searchElement: T,
    start?: number
  ): number {
    const start = adjustIndex.call(this, arguments, 1, 0);
    for (let index = start; index < this.length; ++index) {
      if (this[index] === searchElement) {
        return index;
      }
    }
    return -1;
  };
  Array.prototype.lastIndexOf ??= function lastIndexOf<T>(
    this: T[],
    searchElement: T
  ): number {
    const start = adjustIndex.call(this, arguments, 1, this.length - 1);
    for (let index = start; index >= 0; --index) {
      if (this[index] === searchElement) {
        return index;
      }
    }
    return -1;
  };

  Array.prototype.entries ??= function entries<T>(this: T[]): [number, T][] {
    return this.map((value, index) => [index, value]);
  };
  Array.prototype.keys ??= function keys<T>(this: T[]): number[] {
    return this.map((_, index) => index);
  };
})();

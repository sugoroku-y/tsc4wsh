interface ArrayConstructor {
  isArray(a: any): a is any[];
  from(arrayLike: any): any[];
}

interface Array<T> {
  includes(target: any): boolean;
  fill(v: any): any[];
}

(function(this: any) {
  Array.isArray =
    Array.isArray ||
    function isArray(obj: any) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };
  (Array as any).of =
    (Array as any).of ||
    function of() {
    return Array.prototype.slice.call(arguments);
  };
  (Array as any).from =
    (Array as any).from ||
    function from(
      arrayLike: any,
      mapFn: (e: any, i: number) => any,
      thisArg: any
    ) {
      if (
        typeof mapFn !== 'function' &&
        Object.prototype.toString.call(mapFn) !== '[object Function]'
      ) {
        mapFn = e => e;
      }
    let array;
    if (Array.isArray(arrayLike)) {
        array = arrayLike.map(mapFn, thisArg);
      } else if (
        typeof arrayLike === 'object' &&
        (typeof arrayLike.Item === 'function' ||
          typeof arrayLike.item === 'function')
      ) {
      array = new Array();
        let i = 0;
      for (const e = new Enumerator(arrayLike); !e.atEnd(); e.moveNext()) {
          array.push(mapFn.call(thisArg, e.item(), i++));
      }
    } else {
      const len = +arrayLike.length || 0;
      array = new Array(len);
      for (let i = 0; i < len; ++i) {
          array[i] = mapFn.call(thisArg, arrayLike[i], i);
      }
    }
      return array;
  };

  Array.prototype.some =
    Array.prototype.some ||
    function some(
      this: any[],
      callback: (e: any, i: number, a: any[]) => any,
      thisObj: any
    ) {
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
  Array.prototype.every =
    Array.prototype.every ||
    function every(
      this: any[],
      callback: (e: any, i: number, a: any[]) => any,
      thisObj: any
    ) {
    return !this.some((e, i, a) => !callback.call(thisObj, e, i, a));
  };

  Array.prototype.reduce =
    Array.prototype.reduce ||
    function reduce(
      this: any[],
      callback: (r: any, e: any, i: number, a: any[]) => any,
      initialValue: any
    ) {
    let index = 0;
    let result = 1 < arguments.length ? initialValue : this[index++];
    for (; index < this.length; ++index) {
        if (!(index in this)) {
          continue;
        }
      result = callback.call(null, result, this[index], index, this);
    }
    return result;
  };
  Array.prototype.reduceRight =
    Array.prototype.reduceRight ||
    function reduceRight(
      this: any[],
      callback: (r: any, e: any, i: number, a: any[]) => any,
      initialValue: any
    ) {
    let index = this.length;
    let result = 1 < arguments.length ? initialValue : this[--index];
    while (index-- > 0) {
        if (!(index in this)) {
          continue;
        }
      result = callback.call(null, result, this[index], index, this);
    }
    return result;
  };
  Array.prototype.forEach =
    Array.prototype.forEach ||
    function forEach(
      this: any[],
      callback: (e: any, i: number, a: any[]) => any,
      thisObj: any
    ) {
      this.reduce(
        (r, e, i, a) => callback.call(thisObj, e, i, a) && false,
        false
      );
    };
  Array.prototype.filter =
    Array.prototype.filter ||
    function filter(
      this: any[],
      callback: (e: any, i: number, a: any[]) => any,
      thisObj: any
    ) {
    return this.reduce((r, e, i, a) => {
        if (callback.call(thisObj, e, i, a)) {
          r.push(e);
        }
      return r;
    }, []);
  };
  Array.prototype.map =
    Array.prototype.map ||
    function map(
      this: any[],
      callback: (e: any, i: number, a: any[]) => any,
      thisObj: any
    ) {
    return this.reduce((r, e, i, a) => {
      r[i] = callback.call(thisObj, e, i, a);
      return r;
    }, []);
  };

  const adjustIndex = (
    args: IArguments,
    index: number,
    length: number,
    defaultValue?: number
  ) => {
    let value = args.length > index ? +args[index] : NaN;
    if (isNaN(value)) {
      if (defaultValue === undefined) {
        throw new Error('arguments[' + index + '] required');
      }
      value = defaultValue;
    }
    if (value < 0) {
      value += length;
      if (value < 0) {
        value = 0;
      }
    }
    return value;
  };
  (Array.prototype as any).copyWithin =
    (Array.prototype as any).copyWithin ||
    function copyWithin(this: any[]) {
      const target = adjustIndex(arguments, 1, this.length);
      const start = adjustIndex(arguments, 1, this.length, 0);
      const end = adjustIndex(arguments, 2, this.length, this.length);
      const targetEnd = Math.min(target + (end - start), this.length);
    if (target < start) {
      for (let i = target; i < targetEnd; ++i) {
          if (!(i in this)) {
            continue;
          }
        this[i] = this[start + i - target];
      }
    } else {
        for (let i = targetEnd; --i >= target; ) {
          if (!(i in this)) {
            continue;
          }
        this[i] = this[start + i - target];
      }
    }
    return this;
  };
  (Array.prototype as any).fill =
    (Array.prototype as any).fill ||
    function fill(this: any[], value: any) {
      const start = adjustIndex(arguments, 1, this.length, 0);
      const end = adjustIndex(arguments, 2, this.length, this.length);
    for (let i = start; i < end; ++i) {
      this[i] = value;
    }
    return this;
  };
  (Array.prototype as any).find =
    (Array.prototype as any).find ||
    function find(
      this: any[],
      pred: (this: any[], e: any, i: number, a: any[]) => any,
      thisArg: any
    ) {
    let result;
      this.some(
        (e, i, a) => pred.call(thisArg, e, i, a) && ((result = e), true)
      );
    return result;
  };
  (Array.prototype as any).findIndex =
    (Array.prototype as any).findIndex ||
    function findIndex(
      this: any[],
      pred: (this: any[], e: any, i: number, a: any[]) => any,
      thisArg: any
    ) {
    let result = -1;
      this.some(
        (e, i, a) => pred.call(thisArg, e, i, a) && ((result = i), true)
      );
    return result;
  };
  (Array.prototype as any).includes =
    (Array.prototype as any).includes ||
    function includes(this: any[], searchElement: any) {
    for (const e of this) {
        if (e === searchElement) {
          return true;
        }
    }
    return false;
  };
  Array.prototype.indexOf =
    Array.prototype.lastIndexOf ||
    function indexOf(this: any[], searchElement: any) {
      for (
        let index = adjustIndex(arguments, 1, this.length, 0);
        index < this.length;
        ++index
      ) {
        if (this[index] === searchElement) {
          return index;
        }
    }
    return -1;
  };
  Array.prototype.lastIndexOf =
    Array.prototype.lastIndexOf ||
    function lastIndexOf(this: any[], searchElement) {
      for (
        let index = adjustIndex(arguments, 1, this.length, this.length - 1);
        index >= 0;
        --index
      ) {
        if (this[index] === searchElement) {
          return index;
        }
    }
    return -1;
  };

  (Array.prototype as any).entries =
    (Array.prototype as any).entries ||
    function entries(this: any[]) {
    return this.map((value, index) => [index, value]);
  };
  (Array.prototype as any).keys =
    (Array.prototype as any).keys ||
    function keys(this: any[]) {
    return this.map((_, index) => index);
  };
})();

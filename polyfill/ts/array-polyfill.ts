(function(this: any) {
  Array.isArray =
    Array.isArray ||
    function isArray(obj: any) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  Array.of =
    Array.of ||
    function of() {
      return Array.prototype.slice.call(arguments);
    };
  Array.from =
    Array.from ||
    function from(
      arrayLike: any,
      mapFn: (e: any, i: number, t: any[]) => any,
      thisArg: any
    ) {
      let array;
      if (Array.isArray(arrayLike)) {
        array = arrayLike;
      } else if (
        typeof arrayLike === 'object' &&
        (typeof arrayLike.Item === 'function' ||
          typeof arrayLike.item === 'function')
      ) {
        array = new Array();
        for (const e = new Enumerator(arrayLike); !e.atEnd(); e.moveNext()) {
          array.push(e.item());
        }
      } else {
        const len = +arrayLike.length || 0;
        array = new Array(len);
        for (let i = 0; i < len; ++i) {
          if (i in arrayLike) {
            array[i] = arrayLike[i];
          }
        }
      }
      return mapFn ? array.map(mapFn, thisArg) : array;
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
  Array.prototype.copyWithin =
    Array.prototype.copyWithin ||
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
  Array.prototype.fill =
    Array.prototype.fill ||
    function fill(this: any[], value: any) {
      const start = adjustIndex(arguments, 1, this.length, 0);
      const end = adjustIndex(arguments, 2, this.length, this.length);
      for (let i = start; i < end; ++i) {
        this[i] = value;
      }
      return this;
    };
  Array.prototype.find =
    Array.prototype.find ||
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
  Array.prototype.findIndex =
    Array.prototype.findIndex ||
    function findIndex(
      this: any[],
      pred: (this: any[], e: any, i: number, a: any[]) => any,
      thisArg
    ) {
      let result = -1;
      this.some(
        (e, i, a) => pred.call(thisArg, e, i, a) && ((result = i), true)
      );
      return result;
    };
  Array.prototype.includes =
    Array.prototype.includes ||
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

  Array.prototype.entries =
    Array.prototype.entries ||
    function entries(this: any[]) {
      return this.map((value, index) => [index, value]);
    };
  Array.prototype.keys =
    Array.prototype.keys ||
    function keys(this: any[]) {
      return this.map((_, index) => index);
    };
})();

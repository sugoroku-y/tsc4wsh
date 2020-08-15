(function (this: any) {
  this.Symbol.iterator = Symbol('iterator');
  function polyfill_iterator(o: any[]) {
    var i = 0;
    return {
      next() {
        return i < o.length ? { value: o[i++] } : { done: true };
      }
    };
  }
  this.Array.prototype[Symbol.iterator] = this.Array.prototype[Symbol.iterator] || function Array_iterator(this: any) {
    return polyfill_iterator(this);
  };
  this.String.prototype[Symbol.iterator] = this.String.prototype[Symbol.iterator] || function String_iterator(this: any) {
    return polyfill_iterator(this);
  };
  if (typeof this.TypedArray === 'function') {
    this.TypedArray.prototype[Symbol.iterator] = this.TypedArray.prototype[Symbol.iterator] || function TypedArray_iterator(this: any) {
      return polyfill_iterator(this);
    };
  }
  if (typeof this.Map === 'function') {
    this.Map.prototype[Symbol.iterator] = this.Map.prototype[Symbol.iterator] || function Map_iterator(this: any) {
      return polyfill_iterator(this.entries());
    };
  }
  if (typeof this.Set === 'function') {
    this.Set.prototype[Symbol.iterator] = this.Set.prototype[Symbol.iterator] || function Set_iterator(this: any) {
      return polyfill_iterator(this.values());
    };
  }
})();

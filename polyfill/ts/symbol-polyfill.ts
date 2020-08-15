// @ts-ignore
function Symbol(this: any, description: string) {
  const symbols: {[id: string]: boolean} = this.Symbol.symbols;
  const id = `Symbol@@${description}@@${new Date().getTime()}@@${Math.random()}`;
  symbols[id] = true;
  return {
    toString() {
      return id;
    },
    valueOf() {
      return description || '';
    },
  };
}

// @ts-ignore
namespace Symbol {
  export declare function isSymbol(sym: any): sym is symbol;
  export declare const iterator: symbol;
  export declare const split: symbol;
}

// var Symbol: SymbolConstructorの宣言が有効なところ向けにSymbolConstructorも宣言しておく
interface SymbolConstructor {
  readonly iterator: symbol;
  readonly split: symbol;
  isSymbol(sym: any): sym is symbol;
}

(function(this: any) {
  const symbols: {[id: string]: boolean} = (this.Symbol.symbols = {});
  const registered: {[key: string]: symbol} = {};
  const keys: {[sym: string]: string} = {};
  // this経由でアクセスしないとSymbolの宣言に邪魔される
  this.Symbol.isSymbol = (symbol: any) => !!symbols[symbol.toString()];
  this.Symbol.for = (key: string) => {
    const existing = registered[key];
    if (existing) {
      return existing;
    }
    const sym = Symbol(key);
    registered[key] = (sym as unknown) as symbol;
    keys[sym.toString()] = key;
    return sym;
  };
  this.Symbol.keyFor = (sym: symbol) => keys[sym.toString()];
})();

(function(this: any) {
  this.Symbol.iterator = Symbol('iterator');
  this.Symbol.iterator = Symbol('split');

  function polyfill_iterator(o: any[]) {
    let i = 0;
    return {
      next() {
        return i < o.length ? {value: o[i++]} : {done: true};
      },
    };
  }
  this.Array.prototype[Symbol.iterator] =
    this.Array.prototype[Symbol.iterator] ||
    function Array_iterator(this: any) {
      return polyfill_iterator(this);
    };
  this.String.prototype[Symbol.iterator] =
    this.String.prototype[Symbol.iterator] ||
    function String_iterator(this: any) {
      return polyfill_iterator(this);
    };
  if (typeof this.TypedArray === 'function') {
    this.TypedArray.prototype[Symbol.iterator] =
      this.TypedArray.prototype[Symbol.iterator] ||
      function TypedArray_iterator(this: any) {
        return polyfill_iterator(this);
      };
  }
  if (typeof this.Map === 'function') {
    this.Map.prototype[Symbol.iterator] =
      this.Map.prototype[Symbol.iterator] ||
      function Map_iterator(this: any) {
        return polyfill_iterator(this.entries());
      };
  }
  if (typeof this.Set === 'function') {
    this.Set.prototype[Symbol.iterator] =
      this.Set.prototype[Symbol.iterator] ||
      function Set_iterator(this: any) {
        return polyfill_iterator(this.values());
      };
  }
})();

interface SymbolConstructor {
  isSymbol(o: unknown): o is symbol;
}

(function (this: any) {
  const symbols: { [id: string]: true } = {};
  // Symbolの実装
  this.Symbol = function Symbol(description: string): symbol {
    // 実際のプロパティ名として扱われる文字列
    const id = `Symbol@@${description}@@${new Date().getTime()}@@${Math.random()}`;
    symbols[id] = true;
    const symbol = {
      // プロパティ名として扱われたり、テンプレートリテラル内で文字列に変換されるときなどはこっち
      toString() {
        return id;
      },
      // ''+～など式の中で使われるときはこっち
      valueOf() {
        return description || "";
      },
    };
    return symbol as unknown as symbol;
  };
  // Object.keysでSymbolを除外するために用意
  this.Symbol.isSymbol = (symbol: unknown): symbol is symbol =>
    String(symbol) in symbols;

  const registered: { [key: string]: symbol } = {};

  this.Symbol.for = (key: string) => (registered[key] ??= Symbol(key));
  this.Symbol.keyFor = (sym: symbol) =>
    Object.entries(registered).find(([, symbol]) => symbol === sym)?.[0];

  this.Symbol.iterator = Symbol("iterator");
  this.Symbol.hasInstance = Symbol('hasInstance');
  this.Symbol.isConcatSpreadable = Symbol('isConcatSpreadable');
  this.Symbol.match = Symbol('match');
  this.Symbol.replace = Symbol('replace');
  this.Symbol.search = Symbol('search');
  this.Symbol.species = Symbol('species');
  this.Symbol.split = Symbol("split");
  this.Symbol.toPrimitive = Symbol('toPrimitive');
  this.Symbol.toStringTag = Symbol('toStringTag');
  this.Symbol.unscopables = Symbol('unscopables');
  this.Symbol.matchAll = Symbol('matchAll');
})();

Array.prototype[Symbol.iterator] ??= function* <T>(this: ArrayLike<T>) {
  for (let i = 0; i < this.length; ++i) {
    yield this[i];
  }
};
String.prototype[Symbol.iterator] ??= function* (this: string) {
  for (let i = 0; i < this.length; ++i) {
    yield this.charAt(i);
  }
};

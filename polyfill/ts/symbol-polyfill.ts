// globalスコープでfunctionとして宣言しないとWScriptのバグなのか関数として扱われない
// しかしそうするとES2015のSymbolの宣言とかち合ってエラーになるので
// tsconfig.jsonのcompilerOptions.targetにはes5を指定する。
function Symbol(description: string): symbol {
  return (Symbol as any).newSymbol(description);
}

(() => {
  const symbols: {[id: string]: true} = {};
  // Symbolの実装
  (Symbol as any).newSymbol = (description: string): symbol => {
    // 実際のプロパティ名として扱われる文字列
    const id = `Symbol@@${description}@@${new Date().getTime()}@@${Math.random()}`;
    symbols[id] = true;
    return ({
      // プロパティ名として扱われたり、テンプレートリテラル内で文字列に変換されるときなどはこっち
      toString() {
        return id;
      },
      // ''+～など式の中で使われるときはこっち
      valueOf() {
        return description || '';
      },
    } as unknown) as symbol;
  };
  // Object.keysでSymbolを除外するために用意
  (Symbol as any).isSymbol = (symbol: unknown) => String(symbol) in symbols;
  const registered: {[key: string]: symbol} = {};
  const keys: {[sym: string]: string} = {};

  // @ts-expect-error
  Symbol.for = (key: string) => {
    const existing = registered[key];
    if (existing) {
      return existing;
    }
    const sym = Symbol(key);
    registered[key] = sym;
    keys[sym.toString()] = key;
    return sym;
  };
  // @ts-expect-error
  Symbol.keyFor = (sym: symbol) => keys[sym.toString()];

  // @ts-expect-error
  Symbol.iterator = Symbol('iterator');
  // @ts-expect-error
  Symbol.split = Symbol('split');

  // @ts-expect-error
  Array.prototype[Symbol.iterator] ??= function<T>(this: ArrayLike<T>) {
    let i = 0;
    const next = () =>
      i < this.length ? {value: this[i++]} : {done: true};
    return {next};
  };
  // @ts-expect-error
  String.prototype[Symbol.iterator] ??= function(this: string) {
    let i = 0;
    const next = () =>
      i < this.length ? {value: this.charAt(i++)} : {done: true};
    return {next};
  };
})();

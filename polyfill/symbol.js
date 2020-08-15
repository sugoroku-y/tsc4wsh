function Symbol(description) {
  var symbols = Symbol.symbols;
  var symbol = {};
  var id = 'Symbol@@' + description + "@@" + new Date().getTime() + "@@" + Math.random();
  symbol.toString = function toString() { return id; };
  symbol.valueOf = function valueOf() { return description || ''; };
  symbols[id] = true;
  return symbol;
}
(function () {
  var symbols = Symbol.symbols = {};
  var registered = {};
  Symbol.isSymbol = function isSymbol(symbol) {
    return symbols[symbol.toString()] || false;
  };
  Symbol['for'] = function _for(key) {
    var sym = registered[key] || (registered[key] = Symbol(key));
    sym.key = key;
    return sym;
  };
  Symbol.keyFor = function keyFor(sym) {
    return sym.key;
  };
})();

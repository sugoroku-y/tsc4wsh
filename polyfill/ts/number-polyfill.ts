interface NumberConstructor {
  isFinite(o: unknown): o is number;
  isInteger(o: unknown): o is number;
  isSafeInteger(o: unknown): o is number;
}

(function (this: any) {
  this.Number.EPSILON = Number.EPSILON || 2.2204460492503130808472633361816e-16;
  this.Number.MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
  this.Number.MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -9007199254740991;
  Number.isFinite ??= (o =>
    typeof o === 'number' &&
    o !== Infinity &&
    o !== -Infinity &&
    !isNaN(o)) as typeof Number.isFinite;
  Number.isInteger ??= (o =>
    typeof o === 'number' && Math.ceil(o) === o) as typeof Number.isInteger;
  Number.isNaN ??= o => typeof o === 'number' && isNaN(o);
  Number.isSafeInteger ??= (o =>
    Number.isInteger(o) &&
    o <= Number.MAX_SAFE_INTEGER &&
    o >= Number.MIN_SAFE_INTEGER) as typeof Number.isSafeInteger;
  Number.parseFloat ??= parseFloat;
  Number.parseInt ??= parseInt;
})();

(function (this: any) {
  this.Number.EPSILON ??= Math.pow(2, -52);
  this.Number.MAX_SAFE_INTEGER ??= Math.pow(2, 53) - 1;
  this.Number.MIN_SAFE_INTEGER ??= -Number.MAX_SAFE_INTEGER;
  Number.isFinite ??= isFinite;
  Number.isInteger ??= isInteger;
  Number.isNaN ??= o => typeof o === 'number' && isNaN(o);
  Number.isSafeInteger ??= isSafeInteger;
  Number.parseFloat ??= parseFloat;
  Number.parseInt ??= parseInt;

  function isFinite(o: unknown): o is number {
    return typeof o === 'number' && o !== Infinity && o !== -Infinity && !isNaN(o);
  }
  function isInteger(o: unknown): o is number {
    return typeof o === 'number' && Math.ceil(o) === o;
  }
  function isSafeInteger(o: unknown): o is number {
    return isInteger(o) && o <= Number.MAX_SAFE_INTEGER && o >= Number.MIN_SAFE_INTEGER;
  }
})();

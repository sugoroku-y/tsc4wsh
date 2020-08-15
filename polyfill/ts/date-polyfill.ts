Date.prototype.toISOString = Date.prototype.toISOString || function toISOString(this: Date) {
  return this.getUTCFullYear() +
    '-' + ('' + (this.getUTCMonth() + 1)).padStart(2, '0') +
    '-' + ('' + this.getUTCDate()).padStart(2, '0') +
    'T' + ('' + this.getUTCHours()).padStart(2, '0') +
    ':' + ('' + this.getUTCMinutes()).padStart(2, '0') +
    ':' + ('' + this.getUTCSeconds()).padStart(2, '0') +
    '.' + ('' + this.getUTCMilliseconds()).padStart(3, '0') +
    'Z';
};
Date.now = Date.now || function now() {
  return new Date().getTime();
};

String.prototype.repeat = String.prototype.repeat || function repeat(this: string, count: number) {
  if (count < 0) throw new Error('repeat count must be non-negative');
  if (count === Infinity) throw new Error('repeat count must be less than infinity');
  if (this.length === 0) {
    if (count < 1) return '';
    throw new Error('empty string');
  }
  var r = '';
  while (count-- > 0) r += this;
  return r;
};
(function () {
  var original_substr = String.prototype.substr;
  String.prototype.substr = function substr(this: string, start: number, length?: number) {
    if (start < 0) start += this.length;
    length = length !== undefined ? length < 0 ? length + this.length - start : length : this.length - start;
    return original_substr.call(this, start, length);
  };
})();
String.prototype.padStart = String.prototype.padStart || function padStart(this: string, length: number, paddings?: string) {
  var count = length - this.length;
  if (count <= 0) return this;
  paddings = paddings || ' ';
  return paddings.repeat((count + paddings.length - 1) / paddings.length).substr(0, count) + this;
};
String.prototype.padEnd = String.prototype.padEnd || function padEnd(this: string, length: number, paddings?: string) {
  var count = length - this.length;
  if (count <= 0) return this;
  paddings = paddings || ' ';
  return this + paddings.repeat((count + paddings.length - 1) / paddings.length).substr(0, count);
};
String.prototype.startsWith = String.prototype.startsWith || function startsWith(this: string, searchString: string, position?: number) {
  position = position !== undefined ? position : 0;
  return this.length - position >= searchString.length && this.lastIndexOf(searchString, position) === position;
};
String.prototype.endsWith = String.prototype.endsWith || function endsWith(this: string, searchString: string, position?: number) {
  position = (position !== undefined ? position : this.length) - searchString.length;
  return position >= 0 && this.indexOf(searchString, position) === position;
};
String.prototype.trim = String.prototype.trim || function trim(this: string) {
  const match = /(?:\S(?:.*\S)?)(?=\s*$)/.exec(this);
  return match && match[0] || '';
};
String.prototype.includes = String.prototype.includes || function includes(this: string, searchString: string, position?: number) {
  if (typeof position !== 'number') position = 0;
  return position + searchString.length <= this.length && this.indexOf(searchString, position) >= 0;
};

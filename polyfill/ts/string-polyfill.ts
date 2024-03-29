(function () {
  String.prototype.repeat ??= function repeat(this: string, count: number): string {
    if (!count) {
      return '';
    }
    if (count < 0) {
      throw new Error('repeat count must be non-negative');
    }
    if (count === Infinity) {
      throw new Error('repeat count must be less than infinity');
    }
    return Array(count).fill(this).join('');
  };
  // もともとsubstrは存在しているが、負の数を指定したときの扱いがES2015のsubstrと違うので上書き
  String.prototype.substr = function substr(this: string, start: number, length?: number): string {
    if (length !== undefined && (!length || length < 0)) {
      return '';
    }
    // なぜかsliceはES2015のものと同じなのでそちらを使用
    return this.slice(
      start,
      length !== undefined ? (start < 0 && start + length >= 0 ? undefined : start + length) : this.length,
    );
  };
  String.prototype.padStart ??= function padStart(this: string, length: number, paddings?: string): string {
    const count = length - this.length;
    if (count <= 0) {
      return `${this}`;
    }
    paddings ??= ' ';
    return paddings.repeat((length / paddings.length + 1) | 0).slice(0, count) + this;
  };
  String.prototype.padEnd ??= function padEnd(this: string, length: number, paddings?: string): string {
    const count = length - this.length;
    if (count <= 0) {
      return `${this}`;
    }
    paddings ??= ' ';
    return this + paddings.repeat((length / paddings.length + 1) | 0).slice(0, count);
  };
  String.prototype.startsWith ??= function startsWith(this: string, searchString: string, position?: number): boolean {
    if (!position) {
      return this.lastIndexOf(searchString, 0) === 0;
    }
    return this.slice(position, position + searchString.length) === searchString;
  };
  String.prototype.endsWith ??= function endsWith(this: string, searchString: string, position?: number): boolean {
    if (!position) {
      const pos = this.length - searchString.length;
      return this.indexOf(searchString, pos) === pos;
    }
    const pos = position - searchString.length;
    return pos >= 0 && this.slice(pos, position) === searchString;
  };
  String.prototype.trim ??= function trim(this: string): string {
    return this.replace(/^\s+|\s+$/g, '');
  };
  String.prototype.includes ??= function includes(this: string, searchString: string, position?: number): boolean {
    return this.indexOf(searchString, position) >= 0;
  };
  const original_split: (sep: string, limit?: number) => string[] = String.prototype.split;
  // separatorにキャプチャを含む正規正規表現を指定したときの挙動、およびSymbol.splitの扱いがES2015のものと合わないので上書き
  String.prototype.split = function split(
    this: string,
    separator: string | RegExp | {[Symbol.split](sss: string, limit?: number): string[]},
    limit?: number,
  ): string[] {
    const str = '' + this;
    if (typeof separator === 'string') {
      // 文字列でのsplitは元のメソッドを呼び出し
      return original_split.call(str, separator, limit);
    }
    // Symbol.splitがあればそちらを使う
    // ※JScriptのRegExpには当然Symbol.splitがない
    if (!(separator instanceof RegExp)) {
      return separator[Symbol.split](str, limit);
    }
    // gをつけて作り直す
    const flags = `g${separator.ignoreCase ? 'i' : ''}${separator.multiline ? 'm' : ''}`;
    // JScriptでは
    // - flagsはない。
    // - 以下のフラグはサポートされていない。
    //   - `y`(sticky)
    //   - `u`(unicode)
    //   - `s`(dotAll)
    //   - `d`(hasIndices)
    const pattern = new RegExp(separator.source, flags);
    // separatorで分割
    let index = 0;
    const result = [];
    for (const match of this.matchAll(pattern)) {
      if (index === match.index && match[0].length === 0) continue;
      result.push(str.slice(index, match.index), ...match.slice(1));
      index = match.index! + match[0].length;
    }
    // 最後の部分を追加
    result.push(str.slice(index));
    return result;
  };
  String.prototype.matchAll ??= function matchAll(this: string, _pattern: RegExp): Generator<RegExpMatchArray, void> {
    if (!_pattern.global) {
      throw new Error(`matchAll with a non-global RegExp`);
    }
    const flags = `g${_pattern.ignoreCase ? 'i' : ''}${_pattern.multiline ? 'm' : ''}`;
    return function*(this: string, pattern: RegExp) {
      let match;
      while (!!(match = pattern.exec(this))) {
        yield match;
      }
    }.call(this, new RegExp(_pattern.source, flags));
  };
  String.prototype.at ??= function at(this: string, index: number): string | undefined {
    return this.charAt((index < 0 ? this.length : 0) + index) || undefined;
  };
})();

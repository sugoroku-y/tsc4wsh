(function () {
  String.prototype.repeat ??=
    function repeat(this: string, count: number): string {
      if (count < 0) {
        throw new Error('repeat count must be non-negative');
      }
      if (count === Infinity) {
        throw new Error('repeat count must be less than infinity');
      }
      if (this.length === 0) {
        if (count < 1) {
          return '';
        }
        throw new Error('empty string');
      }
      let r = '';
      while (count-- > 0) {
        r += this;
      }
      return r;
    };
  const originalSubstr = String.prototype.substr;
  String.prototype.substr = function substr(
    this: string,
    start: number,
    length?: number
  ): string {
    if (start < 0) {
      start += this.length;
    }
    length =
      length !== undefined
        ? length < 0
          ? length + this.length - start
          : length
        : this.length - start;
    return originalSubstr.call(this, start, length);
  };
  String.prototype.padStart ??=
    function padStart(this: string, length: number, paddings?: string): string {
      const count = length - this.length;
      if (count <= 0) {
        return this;
      }
      paddings = paddings || ' ';
      const repeat = length / paddings.length + 1;
      return paddings.repeat(repeat).slice(0, count) + this;
    };
  String.prototype.padEnd ??=
    function padEnd(this: string, length: number, paddings?: string): string {
      const count = length - this.length;
      if (count <= 0) {
        return this;
      }
      paddings = paddings || ' ';
      const repeat = length / paddings.length + 1;
      return this + paddings.repeat(repeat).slice(0, count);
    };
  String.prototype.startsWith ??=
    function startsWith(
      this: string,
      searchString: string,
      position?: number
    ): boolean {
      const pos = position ?? 0;
      return (
        this.length - pos >= searchString.length &&
        this.lastIndexOf(searchString, pos) === pos
      );
    };
  String.prototype.endsWith ??=
    function endsWith(
      this: string,
      searchString: string,
      position?: number
    ): boolean {
      const pos = (position ?? this.length) - searchString.length;
      return pos >= 0 && this.indexOf(searchString, pos) === pos;
    };
  String.prototype.trim ??=
    function trim(this: string): string {
      const match = /(?:\S(?:.*\S)?)(?=\s*$)/.exec(this);
      return (match && match[0]) || '';
    };
  String.prototype.includes ??=
    function includes(
      this: string,
      searchString: string,
      position?: number
    ): boolean {
      if (typeof position !== 'number') {
        position = 0;
      }
      return (
        position + searchString.length <= this.length &&
        this.indexOf(searchString, position) >= 0
      );
    };
  const original_split = String.prototype.split;
  String.prototype.split = function split(
    this: string,
    separator:
      | string
      | RegExp
      | {[Symbol.split](sss: string, limit?: number): string[]},
    limit?: number
  ): string[] {
    const str = '' + this;
    if (typeof separator === "string") {
      // 文字列での分割は元のsplitを使う
      return original_split(separator, limit)
    }
    // Symbol.splitがあればそちらを使う
    if (
      separator &&
      typeof separator !== 'string' &&
      !(separator instanceof RegExp) &&
      typeof separator[Symbol.split] === 'function'
    ) {
      return separator[Symbol.split](str, limit);
    }
    // separatorで分割
    let index = 0;
    const result = [];
    if (separator instanceof RegExp) {
      const pattern = new RegExp(separator.source, separator.flags + 'g');
      let match;
      while (!!(match = pattern.exec(str))) {
        if (match[0].length === 0 && match.index === 0) {
          // 空文字にマッチして
          continue;
        }
        result.push(str.slice(index, match.index), ...match.slice(1));
        index = match.index + match[0].length
      }
      // separatorが正規表現の場合
      // 未分割な文字列の先頭のインデックス
      let prev = 0;
      // globalでなかったらgをつけて再作成
      const re = separator.global
        ? separator
        : new RegExp(
            separator.source,
            `g${separator.multiline ? 'm' : ''}${
              separator.ignoreCase ? 'i' : ''
            }`
          );
      // 正規表現のパターンが見つからなくなるまで検索
      while (true) {
        // まだ見ていないところから検索
        re.lastIndex = index;
        const match = re.exec(str);
        // 見つからなかったら終了
        if (!match) {
          break;
        }
        if (match[0].length) {
          // 見つかったパターンが空文字列でなければ見つかった文字列で分割
          const next = match.index;
          const splitted = str.slice(prev, next);
          result.push(splitted);
          prev = index = next + match[0].length;
        } else {
          // 見つかった文字列が空文字列なら
          if (index === prev) {
            // 前回と同じ検索位置だったら次の文字から検索する
            index = prev + 1;
            if (index >= str.length) {
              // もう検索文字が無いときは今の結果をそのまま返す
              return result;
            }
            continue;
          }
          // もう検索文字列が無いときは終了
          if (index >= str.length) {
            break;
          }
          // 分割した文字列を結果に追加
          const next = index;
          const splitted = str.slice(prev, next);
          prev = next;
          result.push(splitted);
          ++index;
        }
        // サブマッチを結果に追加
        for (let i = 1; i < match.length; ++i) {
          result.push(match[i]);
        }
      }
      // 最後の部分を追加
      result.push(str.slice(prev));
      return result;
    }
    // セパレータが空文字の場合は1文字ごと分割
    if (!separator) {
      return Array.from(str, (_, i) => str.charAt(i));
    }
    // 文字列で分割
    separator = '' + separator;
    while (index < str.length) {
      const next = str.indexOf(separator, index);
      if (next < 0) {
        break;
      }
      result.push(str.slice(index, next));
      index = next + separator.length;
    }
    result.push(str.slice(index));
    return result;
  };
  String.prototype.matchAll =
    String.prototype.matchAll ||
    function* matchAll(
      this: string,
      pattern: RegExp
    ): Generator<RegExpMatchArray, void> {
      if (!pattern.global) {
        throw new Error(
          'String.prototype.matchAll called with a non-global RegExp argument'
        );
      }
      let m;
      while (!!(m = this.match(pattern))) {
        yield m;
      }
    };
})();

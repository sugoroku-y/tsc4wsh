interface String {
  padStart(length: number, padding: string): string;
  padEnd(length: number, padding: string): string;
  repeat(count: number): string;
}
(function() {
  String.prototype.repeat =
    String.prototype.repeat ||
    function repeat(this: string, count: number) {
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
  ) {
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
  String.prototype.padStart =
    String.prototype.padStart ||
    function padStart(this: string, length: number, paddings?: string) {
      const count = length - this.length;
      if (count <= 0) {
        return this;
      }
      paddings = paddings || ' ';
      return (
        paddings
          .repeat((count + paddings.length - 1) / paddings.length)
          .substr(0, count) + this
      );
    };
  String.prototype.padEnd =
    String.prototype.padEnd ||
    function padEnd(this: string, length: number, paddings?: string) {
      const count = length - this.length;
      if (count <= 0) {
        return this;
      }
      paddings = paddings || ' ';
      return (
        this +
        paddings
          .repeat((count + paddings.length - 1) / paddings.length)
          .substr(0, count)
      );
    };
  (String.prototype as any).startsWith =
    (String.prototype as any).startsWith ||
    function startsWith(this: string, searchString: string, position?: number) {
      position = position !== undefined ? position : 0;
      return (
        this.length - position >= searchString.length &&
        this.lastIndexOf(searchString, position) === position
      );
    };
  (String.prototype as any).endsWith =
    (String.prototype as any).endsWith ||
    function endsWith(this: string, searchString: string, position?: number) {
      position =
        (position !== undefined ? position : this.length) - searchString.length;
      return position >= 0 && this.indexOf(searchString, position) === position;
    };
  String.prototype.trim =
    String.prototype.trim ||
    function trim(this: string) {
      const match = /(?:\S(?:.*\S)?)(?=\s*$)/.exec(this);
      return (match && match[0]) || '';
    };
  (String.prototype as any).includes =
    (String.prototype as any).includes ||
    function includes(this: string, searchString: string, position?: number) {
      if (typeof position !== 'number') {
        position = 0;
      }
      return (
        position + searchString.length <= this.length &&
        this.indexOf(searchString, position) >= 0
      );
    };
  String.prototype.split = function split(
    this: string,
    separator:
      | string
      | RegExp
      | {[Symbol.split](sss: string, limit?: number): string[]},
    limit?: number
  ) {
    const str = '' + this;
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
          const splitted = str.substr(prev, next - prev);
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
          const splitted = str.substr(prev, next - prev);
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
      result.push(str.substr(prev));
      return result;
    }
    // セパレータが空文字の場合は1文字ごと分割
    if (!separator) {
      return Array(str.length)
        .fill(0)
        .map((_, i) => str.substr(i, 1));
    }
    // 文字列で分割
    separator = '' + separator;
    while (index < str.length) {
      const next = str.indexOf(separator, index);
      if (next < 0) {
        break;
      }
      result.push(str.substr(index, next - index));
      index = next + separator.length;
    }
    result.push(str.substr(index));
    return result;
  };
})();

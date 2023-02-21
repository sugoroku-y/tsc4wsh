/// <reference path="./object-polyfill.ts" />

(function (this: any) {
  const ENQUOTE: {[ch: string]: string} = {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
  };
  const DEQUOTE = Object.fromEntries(Object.entries(ENQUOTE).map(([ch, enquote]) => [enquote, ch]));
  const ENQUOTE_RE = /[\x00-\x1f\\"]/g;
  const DEQUOTE_RE = /\\(?:u([0-9A-Fa-f]{4})|.)/g;

  const ACCEPT_TYPES: {[type: string]: true} = {
    boolean: true,
    number: true,
    object: true, // arrayもnullもtypeofはobject
    string: true,
    undefined: true,
  };

  this.JSON = this.JSON || {};

  function enquote(str: string): string {
    return `"${str.replace(ENQUOTE_RE, ch =>
      '\\"'.includes(ch)
        ? `\\${ch}`
        : ch in ENQUOTE
        ? ENQUOTE[ch]
        : '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0'),
    )}"`;
  }
  function dequote(quoted: string): string {
    return quoted
      .slice(1, -1)
      .replace(DEQUOTE_RE, (enquote, hex) =>
        hex ? String.fromCharCode(parseInt(hex, 16)) : enquote in DEQUOTE ? DEQUOTE[enquote] : enquote.charAt(1),
      );
  }

  const cache: {[pattern: string]: RegExp} = {};

  // JSON文字列を解析する
  class Parser {
    // 解析位置
    private index = 0;
    constructor(readonly str: string) {}
    // JSON文字列を値に変換
    public parse(reviewer?: (k: string, v: any) => any) {
      const value = this.parseValue();
      this.skipWS();
      if (this.isLeft()) {
        this.failedParsing();
      }
      if (!reviewer) {
        return value;
      }
      return (function recursive(key: string, subvalue: any) {
        if (subvalue && typeof subvalue === 'object') {
          for (const [k, v] of Object.entries(subvalue)) {
            subvalue[k] = recursive(k, v);
          }
        }
        return reviewer(key, subvalue);
      })('', value);
    }
    // 現在位置からだけ正規表現がマッチするように
    private stickyMatch(pattern: string) {
      const re = cache[pattern] || (cache[pattern] = new RegExp(`(?:${pattern})|(?=([\\s\\S]))`, 'g'));
      re.lastIndex = this.index;
      const match = re.exec(this.str);
      if (!match || match[match.length - 1]) {
        return undefined;
      }
      this.index += match[0].length;
      return match;
    }
    // JSONのparseエラー
    private failedParsing(): never {
      // 終端に達していた
      if (!this.isLeft()) {
        throw new Error(`Unexpected the end of string`);
      }
      // エラー位置を取得
      const re = /[^\r\n]*(?:\r?\n|\r|$)/g;
      let [line, bol] = [0, 0];
      while (true) {
        const match = re.exec(this.str);
        if (!match) {
          break;
        }
        const eol = match.index + match[0].length;
        if (eol >= this.index) {
          break;
        }
        ++line;
        bol = eol;
      }
      const column = this.index - bol;
      throw new Error(`unexpected: ${this.str.substr(this.index, 10)} at line: ${line}, column: ${column}`);
    }
    // 空白文字をスキップ
    private skipWS() {
      this.stickyMatch(`\\s+`);
    }
    // 1文字だけ読み込む
    private scanOne(candidates: string, noThrow?: true) {
      this.skipWS();
      if (!this.isLeft()) {
        return this.failedParsing();
      }
      const ch = this.str.charAt(this.index);
      if (candidates.indexOf(ch) < 0) {
        if (noThrow) {
          return undefined;
        }
        return this.failedParsing();
      }
      ++this.index;
      return ch;
    }
    // 特定のワードを値に変換
    private parseWord(pattern: string, value: any): any {
      this.skipWS();
      return this.stickyMatch(pattern) ? value : this.failedParsing();
    }
    // 数値を変換
    private parseNumber() {
      this.skipWS();
      const match = this.stickyMatch(`-?(?:0|[1-9]\\d*)(?:\\.\\d+)?(?:[Ee][-+]?\\d+)?\\b`);
      return match ? +match[0] : this.failedParsing();
    }
    // 文字列を変換
    private parseString() {
      this.skipWS();
      const match = this.stickyMatch(`"[^\\\\"]*(?:\\\\.[^\\\\"]*)*"`);
      return match ? dequote(match[0]) : this.failedParsing();
    }
    // 配列、オブジェクトを変換
    private parseSequence(terminater: string, initialValue: any, continuousProc: (value: any) => any) {
      ++this.index;
      const value = initialValue;
      if (!this.scanOne(terminater, true)) {
        const termsep = terminater + ',';
        do {
          continuousProc(value);
        } while (this.scanOne(termsep) !== terminater);
      }
      return value;
    }
    private parseValue() {
      this.skipWS();
      switch (this.str.charAt(this.index)) {
        case 'n':
          return this.parseWord(`null\\b`, null);
        case 't':
          return this.parseWord(`true\\b`, true);
        case 'f':
          return this.parseWord(`false\\b`, false);
        case '-':
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          return this.parseNumber();
        case '"':
          return this.parseString();
        case '[':
          return this.parseSequence(']', [], arr => {
            arr.push(this.parseValue());
          });
        case '{':
          return this.parseSequence('}', {}, obj => {
            this.skipWS();
            const name = this.parseString();
            this.scanOne(':');
            obj[name] = this.parseValue();
          });
      }
      this.failedParsing();
    }
    // まだ文字が残っているかどうか
    private isLeft(): boolean {
      return this.index < this.str.length;
    }
  }
  this.JSON.parse =
    this.JSON.parse ||
    function parse(str: string, reviewer?: (k: string, value: any) => any) {
      return new Parser(str).parse(reviewer);
    };

  this.JSON.stringify =
    this.JSON.stringify ||
    function stringify(
      value: any,
      replacer?: Array<string | number> | ((key: string, value: any) => any),
      space?: number | string,
    ): string {
      // replacerに配列が指定されたらその配列に指定されたキーだけを残す
      const validKeys = Array.isArray(replacer) ? replacer : undefined;
      // replacerに関数が指定されたらその関数を使って変換する
      const p = typeof replacer === 'function' ? replacer : undefined;
      // spaceに数値が指定されたらその文字数分の空白でインデント、文字列が指定されたらその文字列自体でインデントする
      const indentUnit = typeof space === 'number' ? ' '.repeat(space) : typeof space === 'string' ? space : '';
      // spaceとdepthに応じてインデントを入れる
      const indent = (depth: number) => (indentUnit && '\n' + indentUnit.repeat(depth)) || '';
      return (function sub(v: any, depth: number): string {
        // 単純なデータはそのまま
        switch (v) {
          case undefined:
          case null:
            return 'null';
          case true:
            return 'true';
          case false:
            return 'false';
        }
        // 数値や文字列、オブジェクト
        const handlers: {[type: string]: (value: any) => string} = {
          // 数値の場合、NaNはnullにする。
          number: n => (isNaN(n) ? 'null' : '' + n),
          // 文字列は""で括る
          string: s => enquote(s),
          // objectの場合はtoJSONがあれば呼び出す
          object: o => {
            if (typeof o.toJSON === 'function') {
              const json = o.toJSON();
              // 同じオブジェクトだったら無限ループになるので除外
              if (json !== o) {
                return sub(json, depth);
              }
            }
            // arrayもtypeofではobject
            if (Array.isArray(o)) {
              // 空配列では間に改行を入れない
              if (o.length === 0) {
                return '[]';
              }
              return (
                '[' +
                indent(depth + 1) +
                o
                  .map(
                    (json, i) =>
                      sub(p ? p('' + i, json) : json, depth + 1) ||
                      // 空文字列に変換される値はnullとして扱う
                      'null',
                  )
                  .join(',' + indent(depth + 1)) +
                indent(depth) +
                ']'
              );
            }
            // entryの配列に変換
            const entries = Object.entries(o)
              .filter(([k, sv]) => ACCEPT_TYPES[typeof sv] && (!validKeys || validKeys.includes(k)))
              .map(([k, sv]) => [enquote(k), sub(p ? p(k, sv) : sv, depth + 1)])
              // 空文字列に変換される値は無視
              .filter(([, sv]) => !!sv)
              .map(([k, sv]) => `${k}:${space ? ' ' : ''}${sv}`);
            // 空のオブジェクトは間に改行を入れない
            if (entries.length === 0) {
              return '{}';
            }
            return '{' + indent(depth + 1) + entries.join(',' + indent(depth + 1)) + indent(depth) + '}';
          },
        };
        const handler = handlers[typeof v];
        return handler ? handler(v) : '';
      })(value, 0);
    };
})();

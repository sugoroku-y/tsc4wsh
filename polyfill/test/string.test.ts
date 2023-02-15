describe('String.prototype.repeat', () => {
  test(`'abc'.repeat(3)`, () => {
    expect('abc'.repeat(3)).toBe('abcabcabc');
  });
  test(`'abc'.repeat(0)`, () => {
    expect('abc'.repeat(0)).toBe('');
  });
  test(`'abc'.repeat(NaN)`, () => {
    expect('abc'.repeat(NaN)).toBe('');
  });
  test(`() => 'abc'.repeat(-1)`, () => {
    expect(() => 'abc'.repeat(-1)).toThrow();
  });
  test(`() => 'abc'.repeat(Infinity)`, () => {
    expect(() => 'abc'.repeat(Infinity)).toThrow();
  });
  test(`() => 'abc'.repeat(-Infinity)`, () => {
    expect(() => 'abc'.repeat(-Infinity)).toThrow();
  });
});

describe('String.prototype.substr', () => {
  test(`'abcdefg'.substr(4)`, () => {
    expect('abcdefg'.substr(4)).toBe(`efg`);
  });
  test(`'abcdefg'.substr(1, 3)`, () => {
    expect('abcdefg'.substr(1, 3)).toBe(`bcd`);
  });
  test(`'abcdefg'.substr(-4, 2)`, () => {
    expect('abcdefg'.substr(-4, 2)).toBe(`de`);
  });
  test(`'abcdefg'.substr(-2, 4)`, () => {
    expect('abcdefg'.substr(-2, 4)).toBe(`fg`);
  });
  test(`'abcdefg'.substr(1, 0)`, () => {
    expect('abcdefg'.substr(1, 0)).toBe(``);
  });
  test(`'abcdefg'.substr(1, -1)`, () => {
    expect('abcdefg'.substr(1, -1)).toBe(``);
  });
  test(`'abcdefg'.substr(1, NaN)`, () => {
    expect('abcdefg'.substr(1, NaN)).toBe(``);
  });
  test(`'abcdefg'.substr(4, undefined)`, () => {
    expect('abcdefg'.substr(4, undefined)).toBe(`efg`);
  });
});
describe('String.prototype.padStart', () => {
  test(``, () => {
    expect('abc'.padStart(10)).toBe(`       abc`);
  });
  test(``, () => {
    expect('abcdefghij'.padStart(10)).toBe(`abcdefghij`);
  });
  test(``, () => {
    expect('abcdefghijk'.padStart(10)).toBe(`abcdefghijk`);
  });
  test(``, () => {
    expect('abc'.padStart(10, 'ABC')).toBe(`ABCABCAabc`);
  });
  test(``, () => {
    expect('abcdefghij'.padStart(10, 'ABC')).toBe(`abcdefghij`);
  });
  test(``, () => {
    expect('abcdefghijk'.padStart(10, 'ABC')).toBe(`abcdefghijk`);
  });
});
describe('String.prototype.padEnd', () => {
  test(`'abc'.padEnd(10)`, () => {
    expect('abc'.padEnd(10)).toBe(`abc       `);
  });
  test(`'abcdefghij'.padEnd(10)`, () => {
    expect('abcdefghij'.padEnd(10)).toBe(`abcdefghij`);
  });
  test(`'abcdefghijk'.padEnd(10)`, () => {
    expect('abcdefghijk'.padEnd(10)).toBe(`abcdefghijk`);
  });
  test(`'abc'.padEnd(10, 'ABC')`, () => {
    expect('abc'.padEnd(10, 'ABC')).toBe(`abcABCABCA`);
  });
  test(`'abcdefghij'.padEnd(10, 'ABC')`, () => {
    expect('abcdefghij'.padEnd(10, 'ABC')).toBe(`abcdefghij`);
  });
  test(`'abcdefghijk'.padEnd(10, 'ABC')`, () => {
    expect('abcdefghijk'.padEnd(10, 'ABC')).toBe(`abcdefghijk`);
  });
});
describe('String.prototype.startsWith', () => {
  test(`'abcdefghij'.startsWith('abc')`, () => {
    expect('abcdefghij'.startsWith('abc')).toBe(true);
  });
  test(`'abcdefghij'.startsWith('ABC')`, () => {
    expect('abcdefghij'.startsWith('ABC')).toBe(false);
  });
  test(`'abcdefghij'.startsWith('bcd', 1)`, () => {
    expect('abcdefghij'.startsWith('bcd', 1)).toBe(true);
  });
  test(`'abcdefghij'.startsWith('BCD', 1)`, () => {
    expect('abcdefghij'.startsWith('BCD', 1)).toBe(false);
  });
  test(`'abcdefghij'.startsWith('cde', 2)`, () => {
    expect('abcdefghij'.startsWith('cde', 2)).toBe(true);
  });
  test(`'abcdefghij'.startsWith('CDE', 2)`, () => {
    expect('abcdefghij'.startsWith('CDE', 2)).toBe(false);
  });
  test(`'abcdefghij'.startsWith('hij', 7)`, () => {
    expect('abcdefghij'.startsWith('hij', 7)).toBe(true);
  });
  test(`'abcdefghij'.startsWith('HIJ', 7)`, () => {
    expect('abcdefghij'.startsWith('HIJ', 7)).toBe(false);
  });
  test(`'abcdefghij'.startsWith('ijk', 8)`, () => {
    expect('abcdefghij'.startsWith('ijk', 8)).toBe(false);
  });
});
describe('String.prototype.endsWith', () => {
  test(`'abcdefghij'.endsWith('hij')`, () => {
    expect('abcdefghij'.endsWith('hij')).toBe(true);
  });
  test(`'abcdefghij'.endsWith('HIJ')`, () => {
    expect('abcdefghij'.endsWith('HIJ')).toBe(false);
  });
  test(`'abcdefghij'.endsWith('ghi', 9)`, () => {
    expect('abcdefghij'.endsWith('ghi', 9)).toBe(true);
  });
  test(`'abcdefghij'.endsWith('GHI', 9)`, () => {
    expect('abcdefghij'.endsWith('GHI', 9)).toBe(false);
  });
  test(`'abcdefghij'.endsWith('fgh', 8)`, () => {
    expect('abcdefghij'.endsWith('fgh', 8)).toBe(true);
  });
  test(`'abcdefghij'.endsWith('FGH', 8)`, () => {
    expect('abcdefghij'.endsWith('FGH', 8)).toBe(false);
  });
  test(`'abcdefghij'.endsWith('abc', 3)`, () => {
    expect('abcdefghij'.endsWith('abc', 3)).toBe(true);
  });
  test(`'abcdefghij'.endsWith('ABC', 3)`, () => {
    expect('abcdefghij'.endsWith('ABC', 3)).toBe(false);
  });
  test(`'abcdefghij'.endsWith('@ab', 2)`, () => {
    expect('abcdefghij'.endsWith('@ab', 2)).toBe(false);
  });
});

// 以下はChatGPTにて作成

// [Q] String.prototype.splitのテストケースを作成してください。
// String.prototype.splitの仕様については
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/split
// を参考にすべての仕様を網羅するようにしてください。

// [A] JavaScript の String.prototype.split() メソッドは、
// 文字列を特定のセパレーターに基づいて分割することができます。
// このようなテストケースを書くと次のようになります。

describe('String.prototype.split', () => {
  it('should split the string into an array of substrings', () => {
    const str = 'hello world';
    const result = str.split(' ');
    expect(result).toEqual(['hello', 'world']);
  });

  it('should work with special characters as separators', () => {
    const str = 'hello,world';
    const result = str.split(',');
    expect(result).toEqual(['hello', 'world']);
  });

  it('should work with regular expressions as separators', () => {
    const str = 'hello world';
    const result = str.split(/\s+/);
    expect(result).toEqual(['hello', 'world']);
  });

  it('should limit the number of substrings returned', () => {
    const str = 'hello world';
    const result = str.split(' ', 1);
    expect(result).toEqual(['hello']);
  });

  it('should return an array with the original string if the separator is not found', () => {
    const str = 'hello world';
    const result = str.split('-');
    expect(result).toEqual([str]);
  });

  it('should return an empty array for an empty string', () => {
    const str = '';
    const result = str.split('');
    expect(result).toEqual([]);
  });
});

// このようなテストケースを書くことで、 String.prototype.split() メソッドの
// 挙動を正確に確認することができます。

// [Q] 正規表現のキャプチャ、先読み、後読みを使ったパターンを追加してください

// [A] これまでに作成したテストケースに、正規表現のキャプチャ、先読み、後読みを
// 使ったパターンを追加すると次のようになります。

describe('String.prototype.split', () => {
  // ...前回と同じなので省略

  it('should work with capturing groups in the separator', () => {
    const str = 'hello world';
    const result = str.split(/(\s+)/);
    expect(result).toEqual(['hello', ' ', 'world']);
  });

  // 注: 以下、後読み先読みのテストケースだが、後読み先読みの仕様を間違えている
  // it('should work with positive lookahead in the separator', () => {
  //   const str = 'hello world';
  //   const result = str.split(/\s(?=w)/);
  //   expect(result).toEqual(['hello ', 'world']);
  // });

  // it('should work with positive lookbehind in the separator', () => {
  //   const str = 'hello world';
  //   const result = str.split(/(?<=h)\s/);
  //   expect(result).toEqual(['hello', 'world']);
  // });

  // it('should work with negative lookahead in the separator', () => {
  //   const str = 'hello world';
  //   const result = str.split(/\s(?!w)/);
  //   expect(result).toEqual(['hello', ' world']);
  // });

  // it('should work with negative lookbehind in the separator', () => {
  //   const str = 'hello world';
  //   const result = str.split(/(?<!h)\s/);
  //   expect(result).toEqual(['hello', 'world']);
  // });

  // やり直しを指示するも後読みと先読みを逆に考えているように見える

  // [Q] splitのテストケースで正規表現に後読み先読みを含む場合のテストケースを間違えている。
  // もう一度書き直してください。

  // [A] 申し訳あります。正規表現に後読み先読みを含む場合のテストケースを正しく記述すると
  // 以下のようになります：

  //   test("正規表現に後読みを含む場合、正しい文字列が返されること", () => {
  //     const regex = /\w+(?=\s)/;
  //     const str = "hello world";
  //     const expected = ["hello"];

  //     const result = str.split(regex);

  //     expect(result).toEqual(expected);
  //   });

  //   test("正規表現に先読みを含む場合、正しい文字列が返されること", () => {
  //     const regex = /(?<=\s)\w+/;
  //     const str = "hello world";
  //     const expected = ["world"];

  //     const result = str.split(regex);

  //     expect(result).toEqual(expected);
  //   });

  // 諦めて最初のテストケースを基に手動で書く

  it('should work with positive lookahead in the separator', () => {
    const str = 'hello world';
    const result = str.split(/(?=w)/);
    expect(result).toEqual(['hello ', 'world']);
  });

  // 注: 指示しておいてなんだけど後読みはJScriptではサポートしていないのでコメントアウト
  // it('should work with positive lookbehind in the separator', () => {
  //   const str = 'hello world';
  //   const result = str.split(/(?<=o)/);
  //   expect(result).toEqual(['hello', ' wo', 'rld']);
  // });

  it('should work with negative lookahead in the separator', () => {
    const str = 'hello world';
    const result = str.split(/(l)(?!o)/);
    expect(result).toEqual(['he', 'l', 'lo wor', 'l', 'd']);
  });

  // 注: 指示しておいてなんだけど後読みはJScriptではサポートしていないのでコメントアウト
  // it('should work with negative lookbehind in the separator', () => {
  //   const str = 'hello world';
  //   const result = str.split(/(?<!l)(o)/);
  //   expect(result).toEqual(['hello w', 'o', 'rld']);
  // });
});

// [Q] String.prototype.matchAll のテストケースを作成してください。 
// String.prototype.matchAll の仕様は
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll
// を参考にすべての仕様を網羅するようにしてください。

// [A] 以下が、String.prototype.matchAll のテストケースです：

describe('String.prototype.matchAll', () => {
  test('正規表現にマッチする場合、正規表現にマッチするすべての部分文字列が含まれたイテレータを返すこと', () => {
    const regex = /\w+/g;
    const str = 'hello world';
    // 注: RegExpMatchArrayはそのままではtoEqualで成功しないのでexpect.objectContainingでラップする。
    // またJScriptでは名前付きキャプチャは未サポートでgroupsもないのでコメントアウト
    const expected = [
      expect.objectContaining({index: 0, input: 'hello world', 0: 'hello', /* groups: undefined */}),
      expect.objectContaining({index: 6, input: 'hello world', 0: 'world', /* groups: undefined */}),
    ];

    let result = Array.from(str.matchAll(regex));
    // expect(result).toEqual(expected);
    // 注: TypeScriptという言語指定をしておらずコンパイルエラーになるため
    // 手動で修正
    expect(result as unknown as typeof expected).toEqual(expected);
  });

  test('正規表現にマッチしない場合、空のイテレータを返すこと', () => {
    const regex = /\d+/g;
    const str = 'hello world';

    let result = Array.from(str.matchAll(regex));
    expect(result).toEqual([]);
  });

  test('正規表現にキャプチャが含まれている場合、キャプチャグループとともに正規表現にマッチするすべての部分文字列が含まれたイテレータを返すこと', () => {
    const regex = /(\w+)\s(\w+)/g;
    const str = 'hello world';
    // 注: RegExpMatchArrayはそのままではtoEqualで成功しない。
    const expected = [
      expect.objectContaining({
        index: 0,
        input: 'hello world',
        0: 'hello world',
        1: 'hello',
        2: 'world',
        // groups: { "0": "hello", "1": "world" },
        // 注: groupsは(?<名前>パターン)でキャプチャしたときだけ設定されるのでここではundefinedのはず。
        // そもそもJScriptでは名前付きキャプチャはサポートしていないのでgroupsはない
        // 手動でコメントアウト
      }),
    ];

    let result = Array.from(str.matchAll(regex));
    // expect(result).toEqual(expected);
    // TypeScriptという言語指定をしておらずコンパイルエラーになるため
    // 手動で修正
    expect(result as unknown as typeof expected).toEqual(expected);
  });

  // test("正規表現に先読み、後読みが含まれている場合、正規表現にマッチするすべての部分文字列が含まれたイテレータを返すこと", () => {
  //   const regex = /\b\w+\b/g;
  //   const str = "hello world";
  //   const expected = [
  //     { index: 0, input: "hello world", 0: "hello", groups: undefined },
  //     { index: 6, input: "hello world", 0: "world", groups: undefined },
  //   ];

  //   let result = Array.from(str.matchAll(regex));
  //   expect(result).toEqual(expected);
  // });
  // 注: 先読み、後読み関係ないし、テスト内容は1番目のものと全く同じ。
  // 手動でコメントアウト

  // [Q] 正規表現にgフラグがない場合のテストケースを追加してください。
  // 注: gフラグがない場合のテストケースがなかったので追加指示

  // !The server experienced an error while processing your request. Sorry about that! You can retry your request, or contact us through our help center at help.openai.com if the error persists.
  // 注: なぜかここでエラーが発生。リトライ

  // [A] 次が、正規表現にgフラグがない場合のテストケースです：

  // test("正規表現にgフラグがない場合、正規表現にマッチする最初の部分文字列のみが含まれた配列を返すこと", () => {
  //   const regex = /\w+/;
  //   const str = "hello world";
  //   const expected = ["hello"];

  //   let result = Array.from(str.matchAll(regex));
  //   expect(result).toEqual(expected);
  // });
  // 注: gフラグがない場合の使用を完全に誤解している
  // 手動でコメントアウト

  // [Q] 違います。仕様には「RegExp オブジェクトには /g フラグが必須であり、ない場合は TypeError が発生します。」とあります。
  // 注: 誤解を指摘

  // [A] その通りです。私の誤りで申し訳ありません。指定された仕様に従ってテストケースを作成することはできません。
  // 注: 諦められてしまったので、例外が発生する場合のテストケース記述方法を説明することに

  // [Q] 例外が発生する場合のテストケースは以下のように記述します。

  // ```js
  // expect(() => targetMethod()).toThrow();
  // ```

  // この例では`targetMethod()`を実行すると例外が発生する場合にテストケースは成功したと見なされます。

  // [A] 理解しました。以下が正規表現にgフラグがない場合に発生するTypeErrorのテストケースです：

  test('正規表現にgフラグがない場合、TypeErrorが発生すること', () => {
    const regex = /\w+/;
    const str = 'hello world';

    expect(() => {
      str.matchAll(regex);
    }).toThrow();
  });
});

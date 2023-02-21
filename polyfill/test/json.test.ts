describe('JSON.stringify()', () => {
  test('null', () => {
    expect(JSON.stringify(null)).toBe('null');
  });
  test('true', () => {
    expect(JSON.stringify(true)).toBe('true');
  });
  test('false', () => {
    expect(JSON.stringify(false)).toBe('false');
  });
  test('number', () => {
    for (const n of [0, 1, -1, 0.5, -0.5, 1.25e10, -1.25e-10]) {
      expect(JSON.stringify(n)).toBe('' + n);
    }
  });
  test('string empty', () => {
    expect(JSON.stringify('')).toBe('""');
  });
  test('string lf', () => {
    expect(JSON.stringify('\n')).toBe('"\\n"');
  });
  test('string tab', () => {
    expect(JSON.stringify('\t')).toBe('"\\t"');
  });
  test('string cr', () => {
    expect(JSON.stringify('\r')).toBe('"\\r"');
  });
  test('string ', () => {
    expect(JSON.stringify('\b')).toBe('"\\b"');
  });
  test('string ', () => {
    expect(JSON.stringify('\f')).toBe('"\\f"');
  });
  test('string ', () => {
    expect(JSON.stringify('"')).toBe('"\\""');
  });
  test('string ', () => {
    expect(JSON.stringify('/')).toBe('"/"');
  });
  test('string ', () => {
    expect(JSON.stringify('\\')).toBe('"\\\\"');
  });
  test('string ', () => {
    expect(JSON.stringify('\u0000')).toBe('"\\u0000"');
  });
  test('string ', () => {
    expect(JSON.stringify('\u001f')).toBe('"\\u001f"');
  });
  test('string ', () => {
    expect(JSON.stringify('\u007f')).toBe('"\u007f"');
  });
  test('string ', () => {
    expect(JSON.stringify('\u0100')).toBe('"\u0100"');
  });
  test('array empty', () => {
    expect(JSON.stringify([])).toBe('[]');
  });
  test('array three numbers', () => {
    expect(JSON.stringify([1, 2, 3])).toBe('[1,2,3]');
  });
  test('array three strings', () => {
    expect(JSON.stringify(['abc', 'def', 'ghi'])).toBe('["abc","def","ghi"]');
  });
  test('object empty', () => {
    expect(JSON.stringify({})).toBe('{}');
  });
  test('object three number properties', () => {
    expect(JSON.stringify({a: 1, b: 2, c: 3})).toBe('{"a":1,"b":2,"c":3}');
  });
  test('object three string properties', () => {
    expect(JSON.stringify({a: 'abc', b: 'def', c: 'ghi'})).toBe('{"a":"abc","b":"def","c":"ghi"}');
  });
  test.skip('array includes date', () => {
    expect(JSON.stringify([1, new Date().getVarDate(), 'test'])).toBe('[1,null,"test"]');
  });
  test.skip('object includes date', () => {
    expect(JSON.stringify({a: 1, b: new Date().getVarDate(), c: 'test'})).toBe('{"a":1,"c":"test"}');
  });
});
describe('JSON.parse', () => {
  test('null', () => {
    expect(JSON.parse('null')).toBe(null);
  });
  test('true', () => {
    expect(JSON.parse('true')).toBe(true);
  });
  test('false', () => {
    expect(JSON.parse('false')).toBe(false);
    for (const n of [0, 1, -1, 0.5, -0.5, 1.25e10, -1.25e-10]) {
      expect(JSON.parse('' + n)).toBe(n);
    }
  });
  test('""', () => {
    expect(JSON.parse('""')).toBe('');
  });
  test('"\\n"', () => {
    expect(JSON.parse('"\\n"')).toBe('\n');
  });
  test('"\\t"', () => {
    expect(JSON.parse('"\\t"')).toBe('\t');
  });
  test('"\\r"', () => {
    expect(JSON.parse('"\\r"')).toBe('\r');
  });
  test('"\\b"', () => {
    expect(JSON.parse('"\\b"')).toBe('\b');
  });
  test('"\\f"', () => {
    expect(JSON.parse('"\\f"')).toBe('\f');
  });
  test('"\\""', () => {
    expect(JSON.parse('"\\""')).toBe('"');
  });
  test('"\\/"', () => {
    expect(JSON.parse('"\\/"')).toBe('/');
  });
  test('"\\\\"', () => {
    expect(JSON.parse('"\\\\"')).toBe('\\');
  });
  test('"\\u0000"', () => {
    expect(JSON.parse('"\\u0000"')).toBe('\u0000');
  });
  test('"\\u001f"', () => {
    expect(JSON.parse('"\\u001f"')).toBe('\u001f');
  });
  test('"\\u007f"', () => {
    expect(JSON.parse('"\\u007f"')).toBe('\u007f');
  });
  test('"\\u0100"', () => {
    expect(JSON.parse('"\\u0100"')).toBe('\u0100');
  });
  test('[]', () => {
    expect(JSON.parse('[]')).toEqual([]);
  });
  test('[1, 2, 3]', () => {
    expect(JSON.parse('[1, 2, 3]')).toEqual([1, 2, 3]);
  });
  test('["abc","def","ghi"]', () => {
    expect(JSON.parse('["abc","def","ghi"]')).toEqual(['abc', 'def', 'ghi']);
  });
  test('{}', () => {
    expect(JSON.parse('{}')).toEqual({});
  });
  test('{"a": 1, "b": 2, "c": 3}', () => {
    expect(JSON.parse('{"a": 1, "b": 2, "c": 3}')).toEqual({a: 1, b: 2, c: 3});
  });
  test('{"a": "abc", "b": "def", "c": "ghi"}', () => {
    expect(JSON.parse('{"a": "abc", "b": "def", "c": "ghi"}')).toEqual({
      a: 'abc',
      b: 'def',
      c: 'ghi',
    });
  });
});

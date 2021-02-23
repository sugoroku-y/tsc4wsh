test('JSON.stringify', () => {
  expect(JSON.stringify(null)).toBe('null');
  expect(JSON.stringify(true)).toBe('true');
  expect(JSON.stringify(false)).toBe('false');
  for (const n of [0, 1, -1, 0.5, -0.5, 1.25e10, -1.25e-10]) {
    expect(JSON.stringify(n)).toBe('' + n);
  }
  expect(JSON.stringify('')).toBe('""');
  expect(JSON.stringify('\n')).toBe('"\\n"');
  expect(JSON.stringify('\t')).toBe('"\\t"');
  expect(JSON.stringify('\r')).toBe('"\\r"');
  expect(JSON.stringify('\b')).toBe('"\\b"');
  expect(JSON.stringify('\f')).toBe('"\\f"');
  expect(JSON.stringify('"')).toBe('"\\""');
  expect(JSON.stringify('/')).toBe('"\\/"');
  expect(JSON.stringify('\\')).toBe('"\\\\"');
  expect(JSON.stringify('\u0000')).toBe('"\\u0000"');
  expect(JSON.stringify('\u001f')).toBe('"\\u001f"');
  expect(JSON.stringify('\u007f')).toBe('"\\u007f"');
  expect(JSON.stringify('\u0100')).toBe('"\u0100"');
  expect(JSON.stringify([])).toBe('[]');
  expect(JSON.stringify([1, 2, 3])).toBe('[1,2,3]');
  expect(JSON.stringify(['abc', 'def', 'ghi'])).toBe('["abc","def","ghi"]');
  expect(JSON.stringify({})).toBe('{}');
  expect(JSON.stringify({a: 1, b: 2, c: 3})).toBe('{"a":1,"b":2,"c":3}');
  expect(JSON.stringify({a: 'abc', b: 'def', c: 'ghi'})).toBe(
    '{"a":"abc","b":"def","c":"ghi"}'
  );
  expect(JSON.stringify([1, new Date().getVarDate(), 'test'])).toBe(
    '[1,null,"test"]'
  );
  expect(JSON.stringify({a: 1, b: new Date().getVarDate(), c: 'test'})).toBe(
    '{"a":1,"c":"test"}'
  );
});
test('JSON.parse', () => {
  expect(JSON.parse('null')).toBe(null);
  expect(JSON.parse('true')).toBe(true);
  expect(JSON.parse('false')).toBe(false);
  for (const n of [0, 1, -1, 0.5, -0.5, 1.25e10, -1.25e-10]) {
    expect(JSON.parse('' + n)).toBe(n);
  }
  expect(JSON.parse('""')).toBe('');
  expect(JSON.parse('"\\n"')).toBe('\n');
  expect(JSON.parse('"\\t"')).toBe('\t');
  expect(JSON.parse('"\\r"')).toBe('\r');
  expect(JSON.parse('"\\b"')).toBe('\b');
  expect(JSON.parse('"\\f"')).toBe('\f');
  expect(JSON.parse('"\\""')).toBe('"');
  expect(JSON.parse('"\\/"')).toBe('/');
  expect(JSON.parse('"\\\\"')).toBe('\\');
  expect(JSON.parse('"\\u0000"')).toBe('\u0000');
  expect(JSON.parse('"\\u001f"')).toBe('\u001f');
  expect(JSON.parse('"\\u007f"')).toBe('\u007f');
  expect(JSON.parse('"\\u0100"')).toBe('\u0100');
  expect(JSON.parse('[]')).toEqual([]);
  expect(JSON.parse('[1, 2, 3]')).toEqual([1, 2, 3]);
  expect(JSON.parse('["abc","def","ghi"]')).toEqual(['abc', 'def', 'ghi']);
  expect(JSON.parse('{}')).toEqual({});
  expect(JSON.parse('{"a": 1, "b": 2, "c": 3}')).toEqual({a: 1, b: 2, c: 3});
  expect(JSON.parse('{"a": "abc", "b": "def", "c": "ghi"}')).toEqual({
    a: 'abc',
    b: 'def',
    c: 'ghi',
  });
});

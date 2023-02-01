test('JSON.stringify', () => {
  expect(JSON.stringify(null)).toBe('null');
});
test('JSON.stringify', () => {
  expect(JSON.stringify(true)).toBe('true');
});
test('JSON.stringify', () => {
  expect(JSON.stringify(false)).toBe('false');
});
test('JSON.stringify', () => {
  for (const n of [0, 1, -1, 0.5, -0.5, 1.25e10, -1.25e-10]) {
    expect(JSON.stringify(n)).toBe('' + n);
  }
});
test('JSON.stringify', () => {
  expect(JSON.stringify('')).toBe('""');
});
test('JSON.stringify', () => {
  expect(JSON.stringify('\n')).toBe('"\\n"');
});
test('JSON.stringify', () => {
  expect(JSON.stringify('\t')).toBe('"\\t"');
});
test('JSON.stringify', () => {
  expect(JSON.stringify('\r')).toBe('"\\r"');
});
test('JSON.stringify', () => {
  expect(JSON.stringify('\b')).toBe('"\\b"');
});
test('JSON.stringify', () => {
  expect(JSON.stringify('\f')).toBe('"\\f"');
});
test('JSON.stringify', () => {
  expect(JSON.stringify('"')).toBe('"\\""');
});
test('JSON.stringify', () => {
  expect(JSON.stringify('/')).toBe('"/"');
});
test('JSON.stringify', () => {
  expect(JSON.stringify('\\')).toBe('"\\\\"');
});
test('JSON.stringify', () => {
  expect(JSON.stringify('\u0000')).toBe('"\\u0000"');
});
test('JSON.stringify', () => {
  expect(JSON.stringify('\u001f')).toBe('"\\u001f"');
});
test('JSON.stringify', () => {
  expect(JSON.stringify('\u007f')).toBe('"\u007f"');
});
test('JSON.stringify', () => {
  expect(JSON.stringify('\u0100')).toBe('"\u0100"');
});
test('JSON.stringify', () => {
  expect(JSON.stringify([])).toBe('[]');
});
test('JSON.stringify', () => {
  expect(JSON.stringify([1, 2, 3])).toBe('[1,2,3]');
});
test('JSON.stringify', () => {
  expect(JSON.stringify(['abc', 'def', 'ghi'])).toBe('["abc","def","ghi"]');
});
test('JSON.stringify', () => {
  expect(JSON.stringify({})).toBe('{}');
});
test('JSON.stringify', () => {
  expect(JSON.stringify({a: 1, b: 2, c: 3})).toBe('{"a":1,"b":2,"c":3}');
});
test('JSON.stringify', () => {
  expect(JSON.stringify({a: 'abc', b: 'def', c: 'ghi'})).toBe(
    '{"a":"abc","b":"def","c":"ghi"}'
  );
});
test.skip('JSON.stringify', () => {
  expect(JSON.stringify([1, new Date().getVarDate(), 'test'])).toBe(
    '[1,null,"test"]'
  );
});
test.skip('JSON.stringify', () => {
  expect(JSON.stringify({a: 1, b: new Date().getVarDate(), c: 'test'})).toBe(
    '{"a":1,"c":"test"}'
  );
});
test('JSON.parse: null', () => {
  expect(JSON.parse('null')).toBe(null);
});
test('JSON.parse: ', () => {
  expect(JSON.parse('true')).toBe(true);
});
test('JSON.parse: ', () => {
  expect(JSON.parse('false')).toBe(false);
  for (const n of [0, 1, -1, 0.5, -0.5, 1.25e10, -1.25e-10]) {
    expect(JSON.parse('' + n)).toBe(n);
  }
});
test('JSON.parse: ""', () => {
  expect(JSON.parse('""')).toBe('');
});
test('JSON.parse: "\\n"', () => {
  expect(JSON.parse('"\\n"')).toBe('\n');
});
test('JSON.parse: "\\t"', () => {
  expect(JSON.parse('"\\t"')).toBe('\t');
});
test('JSON.parse: "\\r"', () => {
  expect(JSON.parse('"\\r"')).toBe('\r');
});
test('JSON.parse: "\\b"', () => {
  expect(JSON.parse('"\\b"')).toBe('\b');
});
test('JSON.parse: "\\f"', () => {
  expect(JSON.parse('"\\f"')).toBe('\f');
});
test('JSON.parse: "\\""', () => {
  expect(JSON.parse('"\\""')).toBe('"');
});
test('JSON.parse: "\\/"', () => {
  expect(JSON.parse('"\\/"')).toBe('/');
});
test('JSON.parse: "\\\\"', () => {
  expect(JSON.parse('"\\\\"')).toBe('\\');
});
test('JSON.parse: "\\u0000"', () => {
  expect(JSON.parse('"\\u0000"')).toBe('\u0000');
});
test('JSON.parse: "\\u001f"', () => {
  expect(JSON.parse('"\\u001f"')).toBe('\u001f');
});
test('JSON.parse: "\\u007f"', () => {
  expect(JSON.parse('"\\u007f"')).toBe('\u007f');
});
test('JSON.parse: "\\u0100"', () => {
  expect(JSON.parse('"\\u0100"')).toBe('\u0100');
});
test('JSON.parse: []', () => {
  expect(JSON.parse('[]')).toEqual([]);
});
test('JSON.parse: [1, 2, 3]', () => {
  expect(JSON.parse('[1, 2, 3]')).toEqual([1, 2, 3]);
});
test('JSON.parse: ["abc","def","ghi"]', () => {
  expect(JSON.parse('["abc","def","ghi"]')).toEqual(['abc', 'def', 'ghi']);
});
test('JSON.parse: {}', () => {
  expect(JSON.parse('{}')).toEqual({});
});
test('JSON.parse: {"a": 1, "b": 2, "c": 3}', () => {
  expect(JSON.parse('{"a": 1, "b": 2, "c": 3}')).toEqual({a: 1, b: 2, c: 3});
});
test('JSON.parse: {"a": "abc", "b": "def", "c": "ghi"}', () => {
  expect(JSON.parse('{"a": "abc", "b": "def", "c": "ghi"}')).toEqual({
    a: 'abc',
    b: 'def',
    c: 'ghi',
  });
});

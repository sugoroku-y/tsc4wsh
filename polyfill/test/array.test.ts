describe('Array.isArray()', () => {
  test('never[]', () => {
    expect(Array.isArray([])).toBe(true);
  });
  test('number[]', () => {
    expect(Array.isArray([1, 2, 3])).toBe(true);
  });
  test('string[]', () => {
    expect(Array.isArray(['1', '2', '3'])).toBe(true);
  });
  test('object[]', () => {
    expect(Array.isArray([{}, {}, {}])).toBe(true);
  });
  test('undefined', () => {
    expect(Array.isArray(undefined)).toBe(false);
  });
  test('null', () => {
    expect(Array.isArray(null)).toBe(false);
  });
  test('true', () => {
    expect(Array.isArray(true)).toBe(false);
  });
  test('false', () => {
    expect(Array.isArray(false)).toBe(false);
  });
  test('number', () => {
    expect(Array.isArray(1)).toBe(false);
  });
  test('string', () => {
    expect(Array.isArray('1')).toBe(false);
  });
  test('object', () => {
    expect(Array.isArray({})).toBe(false);
  });
});

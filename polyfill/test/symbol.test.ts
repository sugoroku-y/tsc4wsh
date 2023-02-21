describe('symbol', () => {
  test(`Symbol.keyFor(Symbol('test'))`, () => {
    expect(Symbol.keyFor(Symbol('test'))).toBe(undefined);
  });
  test(`Symbol.keyFor(Symbol.for('test'))`, () => {
    expect(Symbol.keyFor(Symbol.for('test'))).toBe('test');
  });
  test(`Symbol('test') === Symbol.for('test')`, () => {
    expect(Symbol('test')).not.toBe(Symbol.for('test'));
  });
  test(`Symbol.for('test') === Symbol.for('test')`, () => {
    expect(Symbol.for('test')).toBe(Symbol.for('test'));
  });
  test('Symbol.iterator for number array', () => {
    expect([...[1, 2, 3]]).toEqual([1, 2, 3]);
  });
  test('Symbol.iterator for string', () => {
    expect([...'abc']).toEqual(['a', 'b', 'c']);
  });
});

test('symbol', () => {
  expect(Symbol.keyFor(Symbol('test'))).toBe(undefined);
  expect(Symbol.keyFor(Symbol.for('test'))).toBe('test');
  expect(Symbol('test')===Symbol.for('test')).toBe(false);
  expect([...[1,2,3]]).toEqual([1,2,3]);
  expect([..."abc"]).toEqual(['a','b','c']);
})
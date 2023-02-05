describe('Date.prototype.toISOString()', () => {
  test('Valid date', () => {
    expect(new Date(1674432000000).toISOString()).toBe('2023-01-23T00:00:00.000Z');
  });
  test('Invalid date', () => {
    expect(() => new Date(NaN).toISOString()).toThrow();
  });
});
describe('Date.now()', () => {
  test('is number', () => {
    expect(typeof Date.now()).toBe('number');
  });
  test('is not NaN', () => {
    expect(isNaN(Date.now())).toBe(false);
  });
});

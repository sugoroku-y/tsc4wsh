/// <reference types="iterables" />

{
  const I = Iterables;
  test('reduce()', () => {
    expect(I.reduce(I.of(), (r, e) => r + e, '')).toBe('');
    expect(I.of().reduce((r, e) => r + e, '')).toBe('');
  });
  test('reduce((1,2,3,4,5), (r, e) => r + e)', () => {
    expect(I.reduce(I.of(1, 2, 3, 4, 5), (r, e) => r + e)).toBe(15);
    expect(I.of(1, 2, 3, 4, 5).reduce((r, e) => r + e)).toBe(15);
  });
  test('reduce((1), (r, e) => r + e)', () => {
    expect(I.reduce(I.of(1), (r, e) => r + e)).toBe(1);
    expect(I.of(1).reduce((r, e) => r + e)).toBe(1);
  });
  test('reduce((), (r, e) => r + e)', () => {
    expect(() => I.reduce(I.of(), (_, e) => e)).toThrow('Reduce of empty Iterable with no initial value');
    expect(() => I.of().reduce((_, e) => e)).toThrow('Reduce of empty Iterable with no initial value');
  });
  test('reduce((1,2,3))', () => {
    expect(I.reduce(I.of(1, 2, 3), (r, e) => r + e, '')).toBe('123');
    expect(I.of(1, 2, 3).reduce((r, e) => r + e, '')).toBe('123');
  });
}

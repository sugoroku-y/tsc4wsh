/// <reference types="iterables" />
/// <reference path="./test.ts" />

{
  const I = Iterables;
  test('reduce()', () => {
    expect(I.reduce(I.of(), (r, e) => r, '')).toBe('');
  });
  test('reduce((1,2,3,4,5), (r, e) => r + e)', () => {
    expect(I.reduce(I.of(1, 2, 3, 4, 5), (r, e) => r + e)).toBe(15);
  });
  test('reduce((1), (r, e) => r + e)', () => {
    expect(I.reduce(I.of(1), (r, e) => r + e)).toBe(1);
  });
  test('reduce((), (r, e) => r + e)', () => {
    expect(() => I.reduce(I.of() as any, (r: any, e: any) => r + e)).toThrow();
  });
  test('reduce((1,2,3))', () => {
    expect(I.reduce(I.of(1, 2, 3), (r, e) => r + e, '')).toBe('123');
  });
}

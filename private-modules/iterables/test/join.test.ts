/// <reference types="iterables" />
/// <reference path="./test.ts" />

{
  const I = Iterables;
  test('join()', () => {
    expect(I.join(I.of())).toBe('');
    expect(I.of().join()).toBe('');
    expect(I.join(I.of(), ', ')).toBe('');
    expect(I.of().join(', ')).toBe('');
  });
  test('join((1,2,3,4,5))', () => {
    expect(I.join(I.of(1, 2, 3, 4, 5))).toBe('1,2,3,4,5');
    expect(I.of(1, 2, 3, 4, 5).join()).toBe('1,2,3,4,5');
  });
  test('join((1,2,3,4,5), ", ")', () => {
    expect(I.join(I.of(1, 2, 3, 4, 5), ', ')).toBe('1, 2, 3, 4, 5');
    expect(I.of(1, 2, 3, 4, 5).join(', ')).toBe('1, 2, 3, 4, 5');
  });
}

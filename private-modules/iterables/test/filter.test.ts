/// <reference types="iterables" />
/// <reference path="./test.ts" />

{
  const I = Iterables;
  test('filter()', () => {
    expect(I.filter(I.of(), e => true)).toBe(I.of());
  });
  test('filter((1,2,3,4,5), e => e % 2 === 0)', () => {
    expect(I.filter(I.of(1, 2, 3, 4, 5), e => e % 2 === 0)).toBe(I.of(2, 4));
  });
}

/// <reference types="iterables" />
/// <reference path="./test.ts" />

{
  const I = Iterables;
  test(`concat([1, 2, 3], ['4', '5', '6'])`, () => {
    expect(I.concat(I.of(1, 2, 3), I.of('4', '5', '6'))).toBe(
      I.of(1, 2, 3, '4', '5', '6')
    );
  });
}

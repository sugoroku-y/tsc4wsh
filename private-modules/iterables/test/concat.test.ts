/// <reference types="iterables" />

{
  const I = Iterables;
  test(`concat([1, 2, 3], ['4', '5', '6'])`, () => {
    expect(I.concat(I.of(1, 2, 3), I.of('4', '5', '6'))).toEqual(
      I.of(1, 2, 3, '4', '5', '6')
    );
    expect(I.of(1, 2, 3).concat(I.of('4', '5', '6'))).toEqual(
      I.of(1, 2, 3, '4', '5', '6')
    );
  });
}

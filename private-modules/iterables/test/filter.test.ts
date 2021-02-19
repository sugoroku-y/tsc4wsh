/// <reference types="iterables" />

{
  const I = Iterables;
  test('filter()', () => {
    expect(I.filter(I.of(), e => e % 2)).toBe(I.of());
    expect(I.of().filter(e => e % 2)).toBe(I.of());
  });
  test('filter((1,2,3,4,5), e => e % 2 === 0)', () => {
    expect(I.filter(I.of(1, 2, 3, 4, 5), e => e % 2 === 0)).toBe(I.of(2, 4));
    expect(I.of(1, 2, 3, 4, 5).filter(e => e % 2 === 0)).toBe(I.of(2, 4));
  });
}

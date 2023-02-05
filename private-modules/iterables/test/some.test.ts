/// <reference types="iterables" />

{
  const I = Iterables;
  test('some()', () => {
    let count = 0;
    expect(I.some(I.of(), e => (++count, !!e))).toBe(false);
    expect(count).toBe(0);
  });
  test('some()', () => {
    let count = 0;
    expect(I.some(I.of(1, 3, 5, 7, 9), e => (++count, e % 2 === 0))).toBe(false);
    expect(count).toBe(5);
  });
  test('some()', () => {
    let count = 0;
    expect(I.some(I.of(1, 3, 5, 6, 7), e => (++count, e % 2 === 0))).toBe(true);
    expect(count).toBe(4);
  });
}

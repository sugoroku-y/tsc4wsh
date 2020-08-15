/// <reference types="iterables" />
/// <reference path="./test.ts" />

{
  const I = Iterables;
  test('some()', () => {
    let count = 0;
    expect(I.some(I.of(), e => (++count, !!e))).toBe(false);
    expect(count).toBe(0);
  });
  test('some()', () => {
    let count = 0;
    expect(
      I.some(I.of(false, false, false, false, false), e => (++count, e))
    ).toBe(false);
    expect(count).toBe(5);
  });
  test('some()', () => {
    let count = 0;
    expect(
      I.some(I.of(false, false, false, true, false), e => (++count, e))
    ).toBe(true);
    expect(count).toBe(4);
  });
}

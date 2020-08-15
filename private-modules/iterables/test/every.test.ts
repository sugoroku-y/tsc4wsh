/// <reference types="iterables" />
/// <reference path="./test.ts" />

{
  const I = Iterables;
  test('every()', () => {
    let count = 0;
    expect(I.every(I.of(), e => (++count, !!e))).toBe(true);
    expect(count).toBe(0);
  });
  test('every()', () => {
    let count = 0;
    expect(I.every(I.of(true, true, true, true, true), e => (++count, e))).toBe(
      true
    );
    expect(count).toBe(5);
  });
  test('every()', () => {
    let count = 0;
    expect(
      I.every(I.of(true, true, true, false, true), e => (++count, e))
    ).toBe(false);
    expect(count).toBe(4);
  });
}

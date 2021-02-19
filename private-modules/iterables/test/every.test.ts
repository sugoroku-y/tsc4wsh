/// <reference types="iterables" />

{
  const I = Iterables;
  test('every()', () => {
    let count = 0;
    expect(I.every(I.of(), e => (++count, e))).toBe(true);
    expect(count).toBe(0);
    expect(I.of().every(e => (++count, e))).toBe(true);
    expect(count).toBe(0);
  });
  test('every()', () => {
    let count = 0;
    expect(I.every(I.of(1, 3, 5, 7, 9), e => (++count, e % 2))).toBe(true);
    expect(count).toBe(5);
    count = 0;
    expect(I.of(1, 3, 5, 7, 9).every(e => (++count, e % 2))).toBe(true);
    expect(count).toBe(5);
  });
  test('every()', () => {
    let count = 0;
    expect(I.every(I.of(1, 3, 5, 6, 7), e => (++count, e % 2))).toBe(false);
    expect(count).toBe(4);
    count = 0;
    expect(I.of(1, 3, 5, 6, 7).every(e => (++count, e % 2))).toBe(false);
    expect(count).toBe(4);
  });
}

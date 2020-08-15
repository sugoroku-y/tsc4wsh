/// <reference types="generator" />
/// <reference path="./test.ts" />

{
  const G = Generator;
  test('every()', () => {
    let count = 0;
    expect(G.every(G.of(), e => (++count, !!e))).toBe(true);
    expect(count).toBe(0);
  });
  test('every()', () => {
    let count = 0;
    expect(G.every(G.of(true, true, true, true, true), e => (++count, e))).toBe(true);
    expect(count).toBe(5);
  });
  test('every()', () => {
    let count = 0;
    expect(G.every(G.of(true, true, true, false, true), e => (++count, e))).toBe(false);
    expect(count).toBe(4);
  });
}

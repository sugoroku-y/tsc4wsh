/// <reference types="generator" />
/// <reference path="./test.ts" />

{
  const G = Generator;
  test('some()', () => {
    let count = 0;
    expect(G.some(G.of(), e => (++count, !!e))).toBe(false);
    expect(count).toBe(0);
  });
  test('some()', () => {
    let count = 0;
    expect(G.some(G.of(false, false, false, false, false), e => (++count, e))).toBe(false);
    expect(count).toBe(5);
  });
  test('some()', () => {
    let count = 0;
    expect(G.some(G.of(false, false, false, true, false), e => (++count, e))).toBe(true);
    expect(count).toBe(4);
  });
}

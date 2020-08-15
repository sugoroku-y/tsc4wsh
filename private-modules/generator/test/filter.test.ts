/// <reference types="generator" />
/// <reference path="./test.ts" />

{
  const G = Generator;
  test('filter()', () => {
    expect(G.filter(G.of(), e => true)).toBe(G.of());
  });
  test('filter((1,2,3,4,5), e => e % 2 === 0)', () => {
    expect(G.filter(G.of(1, 2, 3, 4, 5), e => e % 2 === 0)).toBe(
      G.of(2, 4)
    );
  });
}

/// <reference types="generator" />
/// <reference path="./test.ts" />

{
  const G = Generator;
  test('map()', () => {
    expect(G.map(G.of(), e => e)).toBe(G.of());
  });
  test('map((1,2,3,4,5), e => "a"+e)', () => {
    expect(G.map(G.of(1,2,3,4, 5), e => "a" + e)).toBe(G.of('a1', 'a2', 'a3', 'a4', 'a5'));
  });
}

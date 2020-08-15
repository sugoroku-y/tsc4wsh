/// <reference types="generator" />
/// <reference path="./test.ts" />

{
  const G = Generator;
  test(`concat([1, 2, 3], ['4', '5', '6'])`, () => {
    expect(G.concat(G.of(1, 2, 3), G.of('4', '5', '6'))).toBe(
      G.of(1, 2, 3, '4', '5', '6')
    );
  });
}

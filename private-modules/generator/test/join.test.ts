/// <reference types="generator" />
/// <reference path="./test.ts" />

{
  const G = Generator;
  test('join()', () => {
    expect(G.join(G.of(), '')).toBe('');
  });
  test('join((1,2,3,4,5), ", ")', () => {
    expect(G.join(G.of(1,2,3,4,5), ', ')).toBe('1, 2, 3, 4, 5');
  });
}

/// <reference types="generator" />
/// <reference path="./test.ts" />

{
  const G = Generator;
  test('forEach()', () => {
    const result = '';
    G.forEach(G.of(), e => e);
    expect(result).toBe('');
  });
  test('forEach()', () => {
    let result = '';
    G.forEach(G.of(1, 2, 3, 4, 5), e => {
      result += e;
    });
    expect(result).toBe('12345');
  });
}

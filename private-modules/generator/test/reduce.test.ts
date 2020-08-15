/// <reference types="generator" />
/// <reference path="./test.ts" />

{
  const G = Generator;
  test('reduce()', () => {
    expect(G.reduce(G.of(), (r, e) => r, '')).toBe('');
  });
  test('reduce((1,2,3,4,5), (r, e) => r + e)', () => {
    expect(G.reduce(G.of(1,2,3,4,5), (r, e) => r + e)).toBe(15);
  });
  test('reduce((1), (r, e) => r + e)', () => {
    expect(G.reduce(G.of(1), (r, e) => r + e)).toBe(1);
  });
  test('reduce((), (r, e) => r + e)', () => {
    expect(() => G.reduce(G.of() as any, (r: any, e: any) => r + e)).toThrow();
  });
  test('reduce((1,2,3))', () => {
    expect(G.reduce(G.of(1, 2, 3), (r, e) => r+e, '')).toBe('123');
  });
}

/// <reference types="iterables" />
/// <reference path="./test.ts" />

{
  const I = Iterables;
  test('forEach()', () => {
    const result = '';
    I.forEach(I.of(), e => e);
    expect(result).toBe('');
  });
  test('forEach()', () => {
    let result = '';
    I.forEach(I.of(1, 2, 3, 4, 5), e => {
      result += e;
    });
    expect(result).toBe('12345');
  });
}

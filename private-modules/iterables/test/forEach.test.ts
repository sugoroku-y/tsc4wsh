/// <reference types="iterables" />

{
  const I = Iterables;
  test('forEach()', () => {
    let result = '';
    I.forEach(I.of(), e => (result += e));
    expect(result).toBe('');
    result = '';
    I.of().forEach(e => (result += e));
    expect(result).toBe('');
  });
  test('forEach()', () => {
    let result = 0;
    I.forEach(I.of(1, 2, 3, 4, 5), e => (result += e));
    expect(result).toBe(15);
    result = 0;
    I.forEach(I.of(1, 2, 3, 4, 5), e => (result += e));
    expect(result).toBe(15);
  });
}

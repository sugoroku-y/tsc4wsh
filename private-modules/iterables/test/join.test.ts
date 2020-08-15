/// <reference types="iterables" />
/// <reference path="./test.ts" />

{
  const I = Iterables;
  test('join()', () => {
    expect(I.join(I.of(), '')).toBe('');
  });
  test('join((1,2,3,4,5), ", ")', () => {
    expect(I.join(I.of(1, 2, 3, 4, 5), ', ')).toBe('1, 2, 3, 4, 5');
  });
}

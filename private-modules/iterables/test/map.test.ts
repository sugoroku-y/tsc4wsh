/// <reference types="iterables" />
/// <reference path="./test.ts" />

{
  const I = Iterables;
  test('map()', () => {
    expect(I.map(I.of(), e => e)).toBe(I.of());
  });
  test('map((1,2,3,4,5), e => "a"+e)', () => {
    expect(I.map(I.of(1, 2, 3, 4, 5), e => 'a' + e)).toBe(
      I.of('a1', 'a2', 'a3', 'a4', 'a5')
    );
  });
}

describe('Array.isArray()', () => {
  test('never[]', () => {
    expect(Array.isArray([])).toBe(true);
  });
  test('number[]', () => {
    expect(Array.isArray([1, 2, 3])).toBe(true);
  });
  test('string[]', () => {
    expect(Array.isArray(['1', '2', '3'])).toBe(true);
  });
  test('object[]', () => {
    expect(Array.isArray([{}, {}, {}])).toBe(true);
  });
  test('undefined', () => {
    expect(Array.isArray(undefined)).toBe(false);
  });
  test('null', () => {
    expect(Array.isArray(null)).toBe(false);
  });
  test('true', () => {
    expect(Array.isArray(true)).toBe(false);
  });
  test('false', () => {
    expect(Array.isArray(false)).toBe(false);
  });
  test('number', () => {
    expect(Array.isArray(1)).toBe(false);
  });
  test('string', () => {
    expect(Array.isArray('1')).toBe(false);
  });
  test('object', () => {
    expect(Array.isArray({})).toBe(false);
  });
});
describe('Array.of', () => {
  test('1,2,3', () => {
    expect(Array.of(1, 2, 3)).toEqual([1, 2, 3]);
  });
});
describe('Array.from', () => {
  test('generator empty', () => {
    expect(Array.from(function*(){}())).toEqual([]);
  });
  test('generator single', () => {
    expect(Array.from(function*(){
      yield 1;
    }())).toEqual([1]);
  });
  test('generator double', () => {
    expect(Array.from(function*(){
      yield 1;
      yield 2;
    }())).toEqual([1, 2]);
  });
  test('generator triple', () => {
    expect(Array.from(function*(){
      yield 1;
      yield 2;
      yield 3;
    }())).toEqual([1, 2, 3]);
  });
  test('generator map', () => {
    expect(Array.from(function*(){
      yield 1;
      yield 2;
      yield 3;
    }(), i => 'abcd'.charAt(i))).toEqual(['b', 'c', 'd']);
  });
  test('array empty', () => {
    expect(Array.from([])).toEqual([]);
  });
  test('array single', () => {
    expect(Array.from([1])).toEqual([1]);
  });
  test('array double', () => {
    expect(Array.from([1, 2])).toEqual([1, 2]);
  });
  test('array triple', () => {
    expect(Array.from([1, 2, 3])).toEqual([1, 2, 3]);
  });
  test('array map', () => {
    expect(Array.from([1, 2, 3], i => 'abcd'.charAt(i))).toEqual(['b', 'c', 'd']);
  });
  test('array like empty', () => {
    expect(Array.from({length: 0})).toEqual([]);
  });
  test('array like single', () => {
    expect(Array.from({length: 1, 0: 1})).toEqual([1]);
  });
  test('array like double', () => {
    expect(Array.from({length: 2, 0: 1, 1: 2})).toEqual([1, 2]);
  });
  test('array like triple', () => {
    expect(Array.from({length: 3, 0: 1, 1: 2, 2: 3})).toEqual([1, 2, 3]);
  });
  test('array like map', () => {
    expect(Array.from({length: 3, 0: 1, 1: 2, 2: 3}, i => 'abcd'.charAt(i))).toEqual(['b', 'c', 'd']);
  });
});

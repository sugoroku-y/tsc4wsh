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

describe('Array.prototype.some', () => {
  it('returns true if at least one element passes the test', () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.some((element) => element > 3);
    expect(result).toBeTruthy();
  });

  it('returns false if all elements fail the test', () => {
    const array = [1, 2, 3, 4, 5];
    const result = array.some((element) => element > 10);
    expect(result).toBeFalsy();
  });

  it('calls the callback function with each element', () => {
    const array = ['apple', 'banana', 'cherry'];
    const callback = jest.fn();
    array.some(callback);
    expect(callback.mock.calls.length).toBe(array.length);
    expect(callback.mock.calls[0][0]).toBe('apple');
    expect(callback.mock.calls[1][0]).toBe('banana');
    expect(callback.mock.calls[2][0]).toBe('cherry');
  });

  it('calls the callback function with the correct index', () => {
    const array = ['apple', 'banana', 'cherry'];
    const callback = jest.fn();
    array.some(callback);
    expect(callback.mock.calls[0][1]).toBe(0);
    expect(callback.mock.calls[1][1]).toBe(1);
    expect(callback.mock.calls[2][1]).toBe(2);
  });

  it('calls the callback function with the correct array', () => {
    const array = ['apple', 'banana', 'cherry'];
    const callback = jest.fn();
    array.some(callback);
    expect(callback.mock.calls[0][2]).toBe(array);
    expect(callback.mock.calls[1][2]).toBe(array);
    expect(callback.mock.calls[2][2]).toBe(array);
  });

  it('uses the correct this value in the callback function', () => {
    const array = ['apple', 'banana', 'cherry'];
    const thisValue = { message: 'hello' };
    const callback = jest.fn(function (this: typeof thisValue) {
      expect(this).toBe(thisValue);
    });
    array.some(callback, thisValue);
  });
});


describe('Array methods', () => {
  let arr: number[];

  beforeEach(() => {
    arr = [1, 2, 3, 4, 5];
  });

  describe('Array.prototype.every()', () => {
    test('returns true if all elements pass the test', () => {
      const result = arr.every((elem) => elem > 0);
      expect(result).toBe(true);
    });

    test('returns false if at least one element fails the test', () => {
      const result = arr.every((elem) => elem < 3);
      expect(result).toBe(false);
    });
  });

  describe('Array.prototype.reduce()', () => {
    test('returns the sum of all elements in the array', () => {
      const result = arr.reduce((acc, curr) => acc + curr, 0);
      expect(result).toBe(15);
    });

    test('returns the product of all elements in the array', () => {
      const result = arr.reduce((acc, curr) => acc * curr, 1);
      expect(result).toBe(120);
    });
  });

  describe('Array.prototype.reduceRight()', () => {
    test('returns the concatenated string of all elements in the array', () => {
      const result = arr.reduceRight((acc, curr) => acc + curr.toString(), '');
      expect(result).toBe('54321');
    });
  });

  describe('Array.prototype.forEach()', () => {
    test('calls the callback function for each element in the array', () => {
      const mockCallback = jest.fn();
      arr.forEach(mockCallback);
      expect(mockCallback).toHaveBeenCalledTimes(5);
    });
  });

  describe('Array.prototype.filter()', () => {
    test('returns a new array with only even elements', () => {
      const result = arr.filter((elem) => elem % 2 === 0);
      expect(result).toEqual([2, 4]);
    });

    test('returns an empty array if no elements pass the test', () => {
      const result = arr.filter((elem) => elem > 10);
      expect(result).toEqual([]);
    });
  });

  describe('Array.prototype.map()', () => {
    test('returns a new array with each element doubled', () => {
      const result = arr.map((elem) => elem * 2);
      expect(result).toEqual([2, 4, 6, 8, 10]);
    });
  });

  describe('Array.prototype.copyWithin', () => {
    test('copies elements within the same array', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = arr.copyWithin(1, 3, 5);
      expect(result).toEqual([1, 4, 5, 4, 5]);
    });
  
    test('works with negative indices', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = arr.copyWithin(-2, -4, -2);
      expect(result).toEqual([1, 2, 4, 3, 4]);
    });
  
    test('does not modify the array if no arguments are passed', () => {
      const arr = [1, 2, 3];
      // @ts-expect-error TypeScriptのlib.es2015.core.d.tsのバグ?引数0のパターンでエラーになる
      const result = arr.copyWithin();
      expect(result).toEqual([1, 2, 3]);
    });
  
    test('does not modify the array if the starting index is greater than or equal to the length of the array', () => {
      const arr = [1, 2, 3];
      const result = arr.copyWithin(3, 0, 2);
      expect(result).toEqual([1, 2, 3]);
    });
  
    test('does not modify the array if the ending index is less than or equal to the starting index', () => {
      const arr = [1, 2, 3];
      const result = arr.copyWithin(1, 2, 1);
      expect(result).toEqual([1, 2, 3]);
    });
  
    test('returns the modified array', () => {
      const arr = [1, 2, 3];
      const result = arr.copyWithin(1, 0, 2);
      expect(result).toBe(arr);
    });
  });
  
  describe('Array.prototype.fill()', () => {
    test('fills the entire array with the specified value', () => {
      arr.fill(0);
      expect(arr).toEqual([0, 0, 0, 0, 0]);
    });

    test('fills a portion of the array with the specified value', () => {
      arr.fill(0, 2, 4);
      expect(arr).toEqual([1, 2, 0, 0, 5]);
    });
  });

  describe('Array.prototype.find()', () => {
    test('returns the first element that passes the test', () => {
      const result = arr.find((elem) => elem % 2 === 0);
      expect(result).toBe(2);
    });

    test('returns undefined if no element passes the test', () => {
      const result = arr.find((elem) => elem > 10);
      expect(result).toBeUndefined();
    });
  });

  describe('Array.prototype.findIndex()', () => {
    test('returns the index of the first element that passes the test', () => {
      const result = arr.findIndex((elem) => elem % 2 === 0);
      expect(result).toBe(1);
    });

    test('returns -1 if no element passes the test', () => {
      const result = arr.findIndex((elem) => elem > 10);
      expect(result).toBe(-1);
    });
  });

  describe('Array.prototype.includes()', () => {
    test('returns true if the array contains the specified element', () => {
      const result = arr.includes(3);
      expect(result).toBe(true);
    });

    test('returns false if the array does not contain the specified element', () => {
      const result = arr.includes(10);
      expect(result).toBe(false);
    });
  });

  describe('Array.prototype.indexOf()', () => {
    test('returns the index of the first occurrence of the specified element', () => {
      const result = arr.indexOf(3);
      expect(result).toBe(2);
    });

    test('returns -1 if the array does not contain the specified element', () => {
      const result = arr.indexOf(10);
      expect(result).toBe(-1);
    });
  });

  describe('Array.prototype.entries()', () => {
    test('returns an iterator object that contains key-value pairs of array indices and elements', () => {
      const result = arr.entries();
      expect(result.next().value).toEqual([0, 1]);
      expect(result.next().value).toEqual([1, 2]);
      expect(result.next().value).toEqual([2, 3]);
      expect(result.next().value).toEqual([3, 4]);
      expect(result.next().value).toEqual([4, 5]);
      expect(result.next().done).toBe(true);
    });
  });


  describe('Array.prototype.keys()', () => {
    test('returns an iterator object that contains the keys of the array', () => {
      const result = arr.keys();
      expect(result.next().value).toBe(0);
      expect(result.next().value).toBe(1);
      expect(result.next().value).toBe(2);
      expect(result.next().value).toBe(3);
      expect(result.next().value).toBe(4);
      expect(result.next().done).toBe(true);
    });

    test('works with an empty array', () => {
      const emptyArr: unknown[] = [];
      const result = emptyArr.keys();
      expect(result.next().done).toBe(true);
    });
  });
});

  // - Array.prototype.fill
  // - Array.prototype.find
  // - Array.prototype.findIndex
  // - Array.prototype.includes
  // - Array.prototype.indexOf
  // - Array.prototype.entries
  // - Array.prototype.keys


describe('Array.prototype.at', () => {
  test('positive index', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    expect(arr.at(2)).toBe('c');
    expect(arr.at(4)).toBe('e');
  });

  test('negative index', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    expect(arr.at(-1)).toBe('e');
    expect(arr.at(-3)).toBe('c');
  });

  test('out of range index', () => {
    const arr = ['a', 'b', 'c', 'd', 'e'];
    expect(arr.at(5)).toBeUndefined();
    expect(arr.at(-6)).toBeUndefined();
  });
});

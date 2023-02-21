describe('Object.keys()', () => {
  test('object', () => {
    expect(Object.keys({aaa: 1, bbb: 'b', ccc: true})).toEqual(['aaa', 'bbb', 'ccc']);
  });
  test('array', () => {
    expect(Object.keys(['aaa', 'bbb', 'ccc'])).toEqual(['0', '1', '2']);
  });
  test('undefined', () => {
    // @ts-expect-error
    expect(() => Object.keys(undefined)).toThrow();
  });
  test('null', () => {
    // @ts-expect-error
    expect(() => Object.keys(null)).toThrow();
  });
  test('true', () => {
    expect(Object.keys(true)).toEqual([]);
  });
  test('false', () => {
    expect(Object.keys(false)).toEqual([]);
  });
  test('number', () => {
    expect(Object.keys(1)).toEqual([]);
  });
  test('string', () => {
    expect(Object.keys('')).toEqual([]);
  });
});

describe('Object.values()', () => {
  test('object', () => {
    expect(Object.values({aaa: 1, bbb: 'b', ccc: true})).toEqual([1, 'b', true]);
  });
  test('array', () => {
    expect(Object.values(['aaa', 'bbb', 'ccc'])).toEqual(['aaa', 'bbb', 'ccc']);
  });
  test('undefined', () => {
    // @ts-expect-error
    expect(() => Object.values(undefined)).toThrow();
  });
  test('null', () => {
    // @ts-expect-error
    expect(() => Object.values(null)).toThrow();
  });
  test('true', () => {
    expect(Object.values(true)).toEqual([]);
  });
  test('false', () => {
    expect(Object.values(false)).toEqual([]);
  });
  test('number', () => {
    expect(Object.values(1)).toEqual([]);
  });
  test('string', () => {
    expect(Object.values('')).toEqual([]);
  });
});

describe('Object.entries()', () => {
  test('object', () => {
    expect(Object.entries({aaa: 1, bbb: 'b', ccc: true})).toEqual([
      ['aaa', 1],
      ['bbb', 'b'],
      ['ccc', true],
    ]);
  });
  test('array', () => {
    expect(Object.entries(['aaa', 'bbb', 'ccc'])).toEqual([
      ['0', 'aaa'],
      ['1', 'bbb'],
      ['2', 'ccc'],
    ]);
  });
  test('undefined', () => {
    // @ts-expect-error
    expect(() => Object.entries(undefined)).toThrow();
  });
  test('null', () => {
    // @ts-expect-error
    expect(() => Object.entries(null)).toThrow();
  });
  test('true', () => {
    expect(Object.entries(true)).toEqual([]);
  });
  test('false', () => {
    expect(Object.entries(false)).toEqual([]);
  });
  test('number', () => {
    expect(Object.entries(1)).toEqual([]);
  });
  test('string', () => {
    expect(Object.entries('')).toEqual([]);
  });
});

describe('Object.fromEntries()', () => {
  test('[]', () => {
    expect(Object.fromEntries([])).toEqual({});
  });
  test('[[aaa, 1]]', () => {
    expect(Object.fromEntries([['aaa', 1]])).toEqual({aaa: 1});
  });
  test('[[aaa, 1],[bbb, true]]', () => {
    expect(
      Object.fromEntries([
        ['aaa', 1],
        ['bbb', true],
      ]),
    ).toEqual({aaa: 1, bbb: true});
  });
  test('[[aaa, 1],[aaa, true]]', () => {
    expect(
      Object.fromEntries([
        ['aaa', 1],
        ['aaa', true],
      ]),
    ).toEqual({aaa: true});
  });
});

describe('Object.create()', () => {
  test('{}', () => {
    expect(Object.create({})).toEqual({});
  });
  test('testfunc', () => {
    const o = Object.create(testfunc);
    expect(o).toEqual({});
    expect(typeof o).toBe('object');
    function testfunc() {}
  });
  test('{aaa:1}', () => {
    const o = Object.create({aaa: 1});
    expect(o).toEqual({});
    expect(o.aaa).toBe(1);
  });
  test.skip('{aaa:1}, {bbb: {value: test}}', () => {
    expect(() => Object.create({aaa: 1}, {bbb: {value: 'test'}})).toThrow();
  });
  test.skip('null', () => {
    expect(() => Object.create(null)).toThrow();
  });
});

describe('Object.assign', () => {
  test('({}, {})', () => {
    expect(Object.assign({}, {})).toEqual({});
  });
  test('({aaa: 1}, {})', () => {
    expect(Object.assign({aaa: 1}, {})).toEqual({aaa: 1});
  });
  test('({}, {bbb: test})', () => {
    expect(Object.assign({}, {bbb: 'test'})).toEqual({bbb: 'test'});
  });
  test('({aaa: 1}, {bbb: test})', () => {
    expect(Object.assign({aaa: 1}, {bbb: 'test'})).toEqual({aaa: 1, bbb: 'test'});
  });
  test('(a, b)', () => {
    const a = {aaa: 1};
    const b = {bbb: 'test'};
    const c = Object.assign(a, b);
    expect(c).toEqual({aaa: 1, bbb: 'test'});
    expect<typeof a>(c).toBe(a);
    expect<typeof b>(c).not.toBe(b);
  });
  test('throws', () => {
    // @ts-expect-error
    expect(() => Object.assign(null)).toThrow();
    // @ts-expect-error
    expect(() => Object.assign(undefined)).toThrow();
  });
});

describe('inheritance', () => {
  class A {
    constructor(readonly name: string) {
      return this;
    }
  }
  class B extends A {
    constructor(name: string, readonly description: string) {
      super(name);
    }
  }
  const a = new A('testA');
  const b = new B('testB', 'descB');
  test('a is A', () => {
    expect(a instanceof A).toBe(true);
  });
  test('a is not B', () => {
    expect(a instanceof B).toBe(false);
  });
  test('b is A', () => {
    expect(b instanceof A).toBe(true);
  });
  test('b is B', () => {
    expect(b instanceof B).toBe(true);
  });
  test('{} is not A', () => {
    expect({} instanceof A).toBe(false);
  });
  test('{} is not B', () => {
    expect({} instanceof B).toBe(false);
  });
});

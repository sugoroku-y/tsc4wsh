test('Object.keys(): object', () => {
  expect(Object.keys({aaa: 1, bbb: 'b', ccc: true})).toEqual(['aaa', 'bbb', 'ccc']);
});
test('Object.keys(): array', () => {
  expect(Object.keys(['aaa', 'bbb', 'ccc'])).toEqual(['0', '1', '2']);
});
test('Object.keys(): undefined', () => {
  // @ts-expect-error
  expect(() => Object.keys(undefined)).toThrow();
});
test('Object.keys(): null', () => {
  // @ts-expect-error
  expect(() => Object.keys(null)).toThrow();
});
test('Object.keys(): true', () => {
  expect(Object.keys(true)).toEqual([]);
});
test('Object.keys(): false', () => {
  expect(Object.keys(false)).toEqual([]);
});
test('Object.keys(): number', () => {
  expect(Object.keys(1)).toEqual([]);
});
test('Object.keys(): string', () => {
  expect(Object.keys('')).toEqual([]);
});

test('Object.values(): object', () => {
  expect(Object.values({aaa: 1, bbb: 'b', ccc: true})).toEqual([1, 'b', true]);
});
test('Object.values(): array', () => {
  expect(Object.values(['aaa', 'bbb', 'ccc'])).toEqual(['aaa', 'bbb', 'ccc']);
});
test('Object.values(): undefined', () => {
  // @ts-expect-error
  expect(() => Object.values(undefined)).toThrow();
});
test('Object.values(): null', () => {
  // @ts-expect-error
  expect(() => Object.values(null)).toThrow();
});
test('Object.values(): true', () => {
  expect(Object.values(true)).toEqual([]);
});
test('Object.values(): false', () => {
  expect(Object.values(false)).toEqual([]);
});
test('Object.values(): number', () => {
  expect(Object.values(1)).toEqual([]);
});
test('Object.values(): string', () => {
  expect(Object.values('')).toEqual([]);
});

test('Object.entries(): object', () => {
  expect(Object.entries({aaa: 1, bbb: 'b', ccc: true})).toEqual([['aaa', 1], ['bbb', 'b'], ['ccc', true]]);
});
test('Object.entries(): array', () => {
  expect(Object.entries(['aaa', 'bbb', 'ccc'])).toEqual([['0', 'aaa'], ['1', 'bbb'], ['2', 'ccc']]);
});
test('Object.entries(): undefined', () => {
  // @ts-expect-error
  expect(() => Object.entries(undefined)).toThrow();
});
test('Object.entries(): null', () => {
  // @ts-expect-error
  expect(() => Object.entries(null)).toThrow();
});
test('Object.entries(): true', () => {
  expect(Object.entries(true)).toEqual([]);
});
test('Object.entries(): false', () => {
  expect(Object.entries(false)).toEqual([]);
});
test('Object.entries(): number', () => {
  expect(Object.entries(1)).toEqual([]);
});
test('Object.entries(): string', () => {
  expect(Object.entries('')).toEqual([]);
});

test('Object.create({})', () => {
  expect(Object.create({})).toEqual({});
});
test('Object.create(testfunc)', () => {
  const o = Object.create(testfunc);
  expect(o).toEqual({});
  expect(typeof o).toBe('object');
  function testfunc() {}
});
test('Object.create({aaa:1})', () => {
  const o = Object.create({aaa:1});
  expect(o).toEqual({});
  expect(o.aaa).toBe(1);
});
test.skip('Object.create({aaa:1}, (bbb: {value: test})', () => {
  expect(() => Object.create({aaa:1}, {bbb: {value: 'test'}})).toThrow();
});
test.skip('Object.create(null)', () => {
  expect(() => Object.create(null)).toThrow();
});

test('Object.assign({}, {})', () => {
  expect(Object.assign({}, {})).toEqual({});
});
test('Object.assign({aaa: 1}, {})', () => {
  expect(Object.assign({aaa: 1}, {})).toEqual({aaa: 1});
});
test('Object.assign({}, {bbb: test})', () => {
  expect(Object.assign({}, {bbb: 'test'})).toEqual({bbb: 'test'});
});
test('Object.assign({aaa: 1}, {bbb: test})', () => {
  expect(Object.assign({aaa: 1}, {bbb: 'test'})).toEqual({ aaa: 1, bbb: 'test'});
});
test('Object.assign(a, b)', () => {
  const a = {aaa: 1};
  const b = {bbb: 'test'};
  const c = Object.assign(a, b);
  expect(c).toEqual({ aaa: 1, bbb: 'test'});
  expect<typeof a>(c).toBe(a);
  expect<typeof b>(c).not.toBe(b);
});
test('Object.assign() throws', () => {
  // @ts-expect-error
  expect(() => Object.assign(null)).toThrow();
  // @ts-expect-error
  expect(() => Object.assign(undefined)).toThrow();
});

test('inheritance', () => {
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
  expect(a instanceof A).toBe(true);
  expect(a instanceof B).toBe(false);
  expect(b instanceof A).toBe(true);
  expect(b instanceof B).toBe(true);
  expect({} instanceof A).toBe(false);
  expect({} instanceof B).toBe(false);
});

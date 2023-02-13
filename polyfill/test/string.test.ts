describe('String.prototype.repeat', () => {
  test(`'abc'.repeat(3)`, () => {
    expect('abc'.repeat(3)).toBe('abcabcabc');
  });
  test(`'abc'.repeat(0)`, () => {
    expect('abc'.repeat(0)).toBe('');
  });
  test(`'abc'.repeat(NaN)`, () => {
    expect('abc'.repeat(NaN)).toBe('');
  });
  test(`() => 'abc'.repeat(-1)`, () => {
    expect(() => 'abc'.repeat(-1)).toThrow();
  });
  test(`() => 'abc'.repeat(Infinity)`, () => {
    expect(() => 'abc'.repeat(Infinity)).toThrow();
  });
  test(`() => 'abc'.repeat(-Infinity)`, () => {
    expect(() => 'abc'.repeat(-Infinity)).toThrow();
  });
});

describe('String.prototype.substr', () => {
  test(`'abcdefg'.substr(4)`, () => {
    expect('abcdefg'.substr(4)).toBe(`efg`);
  });
  test(`'abcdefg'.substr(1, 3)`, () => {
    expect('abcdefg'.substr(1, 3)).toBe(`bcd`);
  });
  test(`'abcdefg'.substr(-4, 2)`, () => {
    expect('abcdefg'.substr(-4, 2)).toBe(`de`);
  });
  test(`'abcdefg'.substr(-2, 4)`, () => {
    expect('abcdefg'.substr(-2, 4)).toBe(`fg`);
  });
  test(`'abcdefg'.substr(1, 0)`, () => {
    expect('abcdefg'.substr(1, 0)).toBe(``);
  });
  test(`'abcdefg'.substr(1, -1)`, () => {
    expect('abcdefg'.substr(1, -1)).toBe(``);
  });
  test(`'abcdefg'.substr(1, NaN)`, () => {
    expect('abcdefg'.substr(1, NaN)).toBe(``);
  });
  test(`'abcdefg'.substr(4, undefined)`, () => {
    expect('abcdefg'.substr(4, undefined)).toBe(`efg`);
  });
});
describe('String.prototype.padStart', () => {
  test(``, () => {
    expect('abc'.padStart(10)).toBe(`       abc`);
  });
  test(``, () => {
    expect('abcdefghij'.padStart(10)).toBe(`abcdefghij`);
  });
  test(``, () => {
    expect('abcdefghijk'.padStart(10)).toBe(`abcdefghijk`);
  });
  test(``, () => {
    expect('abc'.padStart(10, 'ABC')).toBe(`ABCABCAabc`);
  });
  test(``, () => {
    expect('abcdefghij'.padStart(10, 'ABC')).toBe(`abcdefghij`);
  });
  test(``, () => {
    expect('abcdefghijk'.padStart(10, 'ABC')).toBe(`abcdefghijk`);
  });
});
describe('String.prototype.padEnd', () => {
  test(`'abc'.padEnd(10)`, () => {
    expect('abc'.padEnd(10)).toBe(`abc       `);
  });
  test(`'abcdefghij'.padEnd(10)`, () => {
    expect('abcdefghij'.padEnd(10)).toBe(`abcdefghij`);
  });
  test(`'abcdefghijk'.padEnd(10)`, () => {
    expect('abcdefghijk'.padEnd(10)).toBe(`abcdefghijk`);
  });
  test(`'abc'.padEnd(10, 'ABC')`, () => {
    expect('abc'.padEnd(10, 'ABC')).toBe(`abcABCABCA`);
  });
  test(`'abcdefghij'.padEnd(10, 'ABC')`, () => {
    expect('abcdefghij'.padEnd(10, 'ABC')).toBe(`abcdefghij`);
  });
  test(`'abcdefghijk'.padEnd(10, 'ABC')`, () => {
    expect('abcdefghijk'.padEnd(10, 'ABC')).toBe(`abcdefghijk`);
  });
});
describe('String.prototype.startsWith', () => {
  test(`'abcdefghij'.startsWith('abc')`, () => {
    expect('abcdefghij'.startsWith('abc')).toBe(true);
  });
  test(`'abcdefghij'.startsWith('ABC')`, () => {
    expect('abcdefghij'.startsWith('ABC')).toBe(false);
  });
  test(`'abcdefghij'.startsWith('bcd', 1)`, () => {
    expect('abcdefghij'.startsWith('bcd', 1)).toBe(true);
  });
  test(`'abcdefghij'.startsWith('BCD', 1)`, () => {
    expect('abcdefghij'.startsWith('BCD', 1)).toBe(false);
  });
  test(`'abcdefghij'.startsWith('cde', 2)`, () => {
    expect('abcdefghij'.startsWith('cde', 2)).toBe(true);
  });
  test(`'abcdefghij'.startsWith('CDE', 2)`, () => {
    expect('abcdefghij'.startsWith('CDE', 2)).toBe(false);
  });
  test(`'abcdefghij'.startsWith('hij', 7)`, () => {
    expect('abcdefghij'.startsWith('hij', 7)).toBe(true);
  });
  test(`'abcdefghij'.startsWith('HIJ', 7)`, () => {
    expect('abcdefghij'.startsWith('HIJ', 7)).toBe(false);
  });
  test(`'abcdefghij'.startsWith('ijk', 8)`, () => {
    expect('abcdefghij'.startsWith('ijk', 8)).toBe(false);
  });
});
describe('String.prototype.endsWith', () => {
  test(`'abcdefghij'.endsWith('hij')`, () => {
    expect('abcdefghij'.endsWith('hij')).toBe(true);
  });
  test(`'abcdefghij'.endsWith('HIJ')`, () => {
    expect('abcdefghij'.endsWith('HIJ')).toBe(false);
  });
  test(`'abcdefghij'.endsWith('ghi', 9)`, () => {
    expect('abcdefghij'.endsWith('ghi', 9)).toBe(true);
  });
  test(`'abcdefghij'.endsWith('GHI', 9)`, () => {
    expect('abcdefghij'.endsWith('GHI', 9)).toBe(false);
  });
  test(`'abcdefghij'.endsWith('fgh', 8)`, () => {
    expect('abcdefghij'.endsWith('fgh', 8)).toBe(true);
  });
  test(`'abcdefghij'.endsWith('FGH', 8)`, () => {
    expect('abcdefghij'.endsWith('FGH', 8)).toBe(false);
  });
  test(`'abcdefghij'.endsWith('abc', 3)`, () => {
    expect('abcdefghij'.endsWith('abc', 3)).toBe(true);
  });
  test(`'abcdefghij'.endsWith('ABC', 3)`, () => {
    expect('abcdefghij'.endsWith('ABC', 3)).toBe(false);
  });
  test(`'abcdefghij'.endsWith('@ab', 2)`, () => {
    expect('abcdefghij'.endsWith('@ab', 2)).toBe(false);
  });
});

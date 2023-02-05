describe('String.prototype.repeat', () => {
  test(`String.prototype.repeat: abc x 3`, () => {
    expect('abc'.repeat(3)).toBe('abcabcabc');
  });
  test(`String.prototype.repeat: abc x 0`, () => {
    expect('abc'.repeat(0)).toBe('');
  });
  test(`String.prototype.repeat: abc x NaN`, () => {
    expect('abc'.repeat(NaN)).toBe('');
  });
  test(`String.prototype.repeat: abc x -1`, () => {
    expect(() => 'abc'.repeat(-1)).toThrow();
  });
  test(`String.prototype.repeat: abc x Infinity`, () => {
    expect(() => 'abc'.repeat(Infinity)).toThrow();
  });
  test(`String.prototype.repeat: abc x -Infinity`, () => {
    expect(() => 'abc'.repeat(-Infinity)).toThrow();
  });
});

test(`String.prototype.substr(4)`, () => {
  expect('abcdefg'.substr(4)).toBe(`efg`);
});
test(`String.prototype.substr(1, 3)`, () => {
  expect('abcdefg'.substr(1, 3)).toBe(`bcd`);
});
test(`String.prototype.substr(-4, 2)`, () => {
  expect('abcdefg'.substr(-4, 2)).toBe(`de`);
});
test(`String.prototype.substr(-2, 4)`, () => {
  expect('abcdefg'.substr(-2, 4)).toBe(`fg`);
});
test(`String.prototype.substr(1, 0)`, () => {
  expect('abcdefg'.substr(1, 0)).toBe(``);
});
test(`String.prototype.substr(1, -1)`, () => {
  expect('abcdefg'.substr(1, -1)).toBe(``);
});
test(`String.prototype.substr(1, NaN)`, () => {
  expect('abcdefg'.substr(1, NaN)).toBe(``);
});
test(`String.prototype.substr(4, undefined)`, () => {
  expect('abcdefg'.substr(4, undefined)).toBe(`efg`);
});
test(`String.prototype.padStart('abc', 10))`, () => {
  expect('abc'.padStart(10)).toBe(`       abc`);
});
test(`String.prototype.padStart('abcdefghij', 10)`, () => {
  expect('abcdefghij'.padStart(10)).toBe(`abcdefghij`);
});
test(`String.prototype.padStart('abcdefghijk', 10)`, () => {
  expect('abcdefghijk'.padStart(10)).toBe(`abcdefghijk`);
});
test(`String.prototype('abc', 10, 'ABC'))`, () => {
  expect('abc'.padStart(10, 'ABC')).toBe(`ABCABCAabc`);
});
test(`String.prototype('abcdefghij', 10, 'ABC'))`, () => {
  expect('abcdefghij'.padStart(10, 'ABC')).toBe(`abcdefghij`);
});
test(`String.prototype('abcdefghijk', 10, 'ABC'))`, () => {
  expect('abcdefghijk'.padStart(10, 'ABC')).toBe(`abcdefghijk`);
});
test(`String.prototype('abc', 10))`, () => {
  expect('abc'.padEnd(10)).toBe(`abc       `);
});
test(`String.prototype('abcdefghij', 10))`, () => {
  expect('abcdefghij'.padEnd(10)).toBe(`abcdefghij`);
});
test(`String.prototype('abcdefghijk', 10))`, () => {
  expect('abcdefghijk'.padEnd(10)).toBe(`abcdefghijk`);
});
test(`String.prototype('abc', 10, 'ABC'))`, () => {
  expect('abc'.padEnd(10, 'ABC')).toBe(`abcABCABCA`);
});
test(`String.prototype('abcdefghij', 10, 'ABC'))`, () => {
  expect('abcdefghij'.padEnd(10, 'ABC')).toBe(`abcdefghij`);
});
test(`String.prototype('abcdefghijk', 10, 'ABC'))`, () => {
  expect('abcdefghijk'.padEnd(10, 'ABC')).toBe(`abcdefghijk`);
});
test(`String.prototype.startsWith('abc')`, () => {
  expect('abcdefghij'.startsWith('abc')).toBe(true);
});
test(`String.prototype.startsWith('ABC')`, () => {
  expect('abcdefghij'.startsWith('ABC')).toBe(false);
});
test(`String.prototype.startsWith('bcd', 1)`, () => {
  expect('abcdefghij'.startsWith('bcd', 1)).toBe(true);
});
test(`String.prototype.startsWith('BCD', 1)`, () => {
  expect('abcdefghij'.startsWith('BCD', 1)).toBe(false);
});
test(`String.prototype.startsWith('cde', 2)`, () => {
  expect('abcdefghij'.startsWith('cde', 2)).toBe(true);
});
test(`String.prototype.startsWith('CDE', 2)`, () => {
  expect('abcdefghij'.startsWith('CDE', 2)).toBe(false);
});
test(`String.prototype.startsWith('hij', 7)`, () => {
  expect('abcdefghij'.startsWith('hij', 7)).toBe(true);
});
test(`String.prototype.startsWith('HIJ', 7)`, () => {
  expect('abcdefghij'.startsWith('HIJ', 7)).toBe(false);
});
test(`String.prototype.startsWith('ijk', 8)`, () => {
  expect('abcdefghij'.startsWith('ijk', 8)).toBe(false);
});
test(`String.prototype.endsWith('hij')`, () => {
  expect('abcdefghij'.endsWith('hij')).toBe(true);
});
test(`String.prototype.endsWith('HIJ')`, () => {
  expect('abcdefghij'.endsWith('HIJ')).toBe(false);
});
test(`String.prototype.endsWith('ghi', 9)`, () => {
  expect('abcdefghij'.endsWith('ghi', 9)).toBe(true);
});
test(`String.prototype.endsWith('GHI', 9)`, () => {
  expect('abcdefghij'.endsWith('GHI', 9)).toBe(false);
});
test(`String.prototype.endsWith('fgh', 8)`, () => {
  expect('abcdefghij'.endsWith('fgh', 8)).toBe(true);
});
test(`String.prototype.endsWith('FGH', 8)`, () => {
  expect('abcdefghij'.endsWith('FGH', 8)).toBe(false);
});
test(`String.prototype.endsWith('abc', 3)`, () => {
  expect('abcdefghij'.endsWith('abc', 3)).toBe(true);
});
test(`String.prototype.endsWith('ABC', 3)`, () => {
  expect('abcdefghij'.endsWith('ABC', 3)).toBe(false);
});
test(`String.prototype.endsWith('@ab', 2)`, () => {
  expect('abcdefghij'.endsWith('@ab', 2)).toBe(false);
});

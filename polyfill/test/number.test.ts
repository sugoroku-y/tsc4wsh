describe('Number.EPSILON', () => {
  test('+ 1 > 1', () => {
    expect(Number.EPSILON + 1 > 1).toBe(true);
  });
  test('/ 2 + 1 > 1', () => {
    expect(Number.EPSILON / 2 + 1> 1).toBe(false);
  });
});

describe('Number.MAX_SAFE_INTEGER', () => {
  test('< MAX_SAFE_INTEGER + 1', () => {
    expect(Number.MAX_SAFE_INTEGER < Number.MAX_SAFE_INTEGER + 1).toBe(true);
  });
  test('+ 1 < MAX_SAFE_INTEGER + 2', () => {
    expect(Number.MAX_SAFE_INTEGER + 1 < Number.MAX_SAFE_INTEGER + 2).toBe(false);
  });
});

describe('Number.MIN_SAFE_INTEGER', () => {
  test('> MIN_SAFE_INTEGER - 1', () => {
    expect(Number.MIN_SAFE_INTEGER > Number.MIN_SAFE_INTEGER - 1).toBe(true);
  });
  test('- 1 > MIN_SAFE_INTEGER - 2', () => {
    expect(Number.MIN_SAFE_INTEGER - 1 > Number.MAX_SAFE_INTEGER - 2).toBe(false);
  });
});


describe('Number.isFinite', () => {
  test('(1)', () => {
    expect(Number.isFinite(1)).toBe(true);
  });
  test('(NaN)', () => {
    expect(Number.isFinite(NaN)).toBe(false);
  });
  test('(Infinity)', () => {
    expect(Number.isFinite(Infinity)).toBe(false);
  });
  test('(-Infinity)', () => {
    expect(Number.isFinite(-Infinity)).toBe(false);
  });
  test('(1/0)', () => {
    expect(Number.isFinite(1/0)).toBe(false);
  });
});

describe('Number.isInteger', () => {
  test('(1)', () => {
    expect(Number.isInteger(1)).toBe(true);
  });
  test('(Number.MAX_SAFE_INTEGER)', () => {
    expect(Number.isInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
  });
  test('(Number.MAX_SAFE_INTEGER + 1)', () => {
    expect(Number.isInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(true);
  });
  test('(Number.MAX_SAFE_INTEGER + 1.5)', () => {
    expect(Number.isInteger(Number.MAX_SAFE_INTEGER + 1.5)).toBe(true);
  });
  test('(Number.MIN_SAFE_INTEGER)', () => {
    expect(Number.isInteger(Number.MIN_SAFE_INTEGER)).toBe(true);
  });
  test('(Number.MIN_SAFE_INTEGER - 1)', () => {
    expect(Number.isInteger(Number.MIN_SAFE_INTEGER - 1)).toBe(true);
  });
  test('(Number.MIN_SAFE_INTEGER - 1.5)', () => {
    expect(Number.isInteger(Number.MIN_SAFE_INTEGER - 1.5)).toBe(true);
  });
  test('(10 + Number.EPSILON)', () => {
    expect(Number.isInteger(10 + Number.EPSILON)).toBe(true);
  });
  test('(1 + Number.EPSILON)', () => {
    expect(Number.isInteger(1 + Number.EPSILON)).toBe(false);
  });
});

describe('Number.isNaN', () => {
  test('(NaN)', () => {
    expect(Number.isNaN(NaN)).toBe(true);
  });
  test('(1)', () => {
    expect(Number.isNaN(1)).toBe(false);
  });
  test('(Infinity)', () => {
    expect(Number.isNaN(Infinity)).toBe(false);
  });
  test('(-Infinity)', () => {
    expect(Number.isNaN(-Infinity)).toBe(false);
  });
  test(`('1')`, () => {
    expect(Number.isNaN('1')).toBe(false);
  });
  test(`('a')`, () => {
    expect(Number.isNaN('a')).toBe(false);
  });
  test(`('NaN')`, () => {
    expect(Number.isNaN('NaN')).toBe(false);
  });
});

describe('Number.isSafeInteger', () => {
  test('(1)', () => {
    expect(Number.isSafeInteger(1)).toBe(true);
  });
  test('(Number.MAX_SAFE_INTEGER)', () => {
    expect(Number.isSafeInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
  });
  test('(Number.MAX_SAFE_INTEGER + 1)', () => {
    expect(Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
  });
  test('(Number.MAX_SAFE_INTEGER + 1.5)', () => {
    expect(Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1.5)).toBe(false);
  });
  test('(Number.MIN_SAFE_INTEGER)', () => {
    expect(Number.isSafeInteger(Number.MIN_SAFE_INTEGER)).toBe(true);
  });
  test('(Number.MIN_SAFE_INTEGER - 1)', () => {
    expect(Number.isSafeInteger(Number.MIN_SAFE_INTEGER - 1)).toBe(false);
  });
  test('(Number.MIN_SAFE_INTEGER - 1.5)', () => {
    expect(Number.isSafeInteger(Number.MIN_SAFE_INTEGER - 1.5)).toBe(false);
  });
  test('(10 + Number.EPSILON)', () => {
    expect(Number.isSafeInteger(10 + Number.EPSILON)).toBe(true);
  });
  test('(1 + Number.EPSILON)', () => {
    expect(Number.isSafeInteger(1 + Number.EPSILON)).toBe(false);
  });
});

describe('Number.parseFloat', () => {
  test(`('1')`, () => {
    expect(Number.parseFloat('1')).toBe(1);
  });
  test(`('1.5')`, () => {
    expect(Number.parseFloat('1.5')).toBe(1.5);
  });
  test(`('-1.1')`, () => {
    expect(Number.parseFloat('-1.1')).toBe(-1.1);
  });
  test(`('1.12e+10')`, () => {
    expect(Number.parseFloat('1.12e+10')).toBe(1.12e+10);
  });
  test(`('-8.9e-10')`, () => {
    expect(Number.parseFloat('-8.9e-10')).toBe(-8.9e-10);
  });
  test(`('-.7e-20')`, () => {
    expect(Number.parseFloat('-.7e-20')).toBe(-.7e-20);
  });
  test(`('a')`, () => {
    expect(Number.isNaN(Number.parseFloat('a'))).toBe(true);
  });
});

describe('Number.parseInt', () => {
  test(`('1')`, () => {
    expect(Number.parseInt('1')).toBe(1);
  });
  test(`('1.5')`, () => {
    expect(Number.parseInt('1.5')).toBe(1);
  });
  test(`('-1.1')`, () => {
    expect(Number.parseInt('-1.1')).toBe(-1);
  });
  test(`('1.12e+10')`, () => {
    expect(Number.parseInt('1.12e+10')).toBe(1);
  });
  test(`('-8.9e-10')`, () => {
    expect(Number.parseInt('-8.9e-10')).toBe(-8);
  });
  test(`('-.7e-20')`, () => {
    expect(Number.isNaN(Number.parseInt('-.7e-20'))).toBe(true);
  });
  test(`('a')`, () => {
    expect(Number.isNaN(Number.parseInt('a'))).toBe(true);
  });
});

test('Date.prototype.toISOString(): valid date', () => {
    expect(new Date(1674432000000).toISOString()).toBe('2023-01-23T00:00:00.000Z');
});
test('Date.prototype.toISOString(): Invalid date', () => {
    expect(() => new Date(NaN).toISOString()).toThrow();
});
test('Date.now(): is number', () => {
    expect(typeof Date.now()).toBe('number');
});
test('Date.now(): is not NaN', () => {
    expect(isNaN(Date.now())).toBe(false);
});

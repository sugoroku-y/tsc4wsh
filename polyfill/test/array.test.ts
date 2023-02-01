test('Array.isArray(): never[]', () => {
    expect(Array.isArray([])).toBe(true);
});
test('Array.isArray(): number[]', () => {
    expect(Array.isArray([1, 2, 3])).toBe(true);
});
test('Array.isArray(): string[]', () => {
    expect(Array.isArray(['1', '2', '3'])).toBe(true);
});
test('Array.isArray(): object[]', () => {
    expect(Array.isArray([{}, {}, {}])).toBe(true);
});
test('Array.isArray(): undefined', () => {
    expect(Array.isArray(undefined)).toBe(false);
});
test('Array.isArray(): null', () => {
    expect(Array.isArray(null)).toBe(false);
});
test('Array.isArray(): true', () => {
    expect(Array.isArray(true)).toBe(false);
});
test('Array.isArray(): false', () => {
    expect(Array.isArray(false)).toBe(false);
});
test('Array.isArray(): number', () => {
    expect(Array.isArray(1)).toBe(false);
});
test('Array.isArray(): string', () => {
    expect(Array.isArray('1')).toBe(false);
});
test('Array.isArray(): object', () => {
    expect(Array.isArray({})).toBe(false);
});

(function () {
  function format(template: TemplateStringsArray, ...values: (number | [number, number])[]): string {
    return template.reduce((r, e, i) => {
      const v = values[i - 1];
      const [num, digits] = Array.isArray(v) ? v : [v, 2];
      return r + (digits ? num.toString().padStart(digits, '0') : num) + e;
    });
  }
  Date.prototype.toISOString ??= function toISOString(this: Date): string {
    if (isNaN(this.getTime())) {
      throw new Error('Invalid date');
    }
    return format`${this.getUTCFullYear()}-${
      this.getUTCMonth() + 1
    }-${this.getUTCDate()}T${this.getUTCHours()}:${this.getUTCMinutes()}:${this.getUTCSeconds()}.${[
      this.getUTCMilliseconds(),
      3,
    ]}Z`;
  };
  Date.now ??= function now() {
    return new Date().getTime();
  };
})();

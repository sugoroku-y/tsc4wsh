/// <reference path="./symbol-polyfill.ts" />

(function () {
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const dontEnums = [
    'toString',
    'toLocaleString',
    'valueOf',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'constructor',
  ];
  Object.keys ??= function keys(obj: unknown) {
      if (obj === null || 
        typeof obj !== 'function' &&
        typeof obj !== 'object'
      ) {
        throw new TypeError('Object.keys called on non-object');
      }

      const result = [];
      for (const prop in obj) {
        if ((Symbol as any).isSymbol(prop)) {
          continue;
        }
        if (!hasOwnProperty.call(obj, prop)) {
          continue;
        }
        result.push(prop);
      }
      for (const name of dontEnums) {
        if (!hasOwnProperty.call(obj, name)) {
          continue;
        }
        result.push(name);
      }
      return result;
    };
  Object.entries ??=
    function entries(obj: unknown) {
      return Object.keys(obj).map<[string, unknown]>(key => [key, obj[key]]);
    };
  Object.values ??=
    function values(obj: unknown) {
      return Object.keys(obj).map(key => obj[key]);
    };
  Object.create ??=
    function create(proto: unknown, propertiesObject?: unknown) {
      if (typeof proto !== 'object' && typeof proto !== 'function') {
        throw new TypeError('Object prototype may only be an Object: ' + proto);
      }
      if (proto === null) {
        throw new Error(
          `This Object.create is a shim and doesn't support 'null' as the first argument.`
        );
      }
      if (propertiesObject !== undefined) {
        throw new Error(
          `This Object.create is a shim and doesn't support a second argument.`
        );
      }

      const F = function() {};
      F.prototype = proto;
      return new (F as any)();
    };
  Object.assign ??=
    function assign(target: unknown, ...sources: unknown[]) {
      if (target == null) {
        throw new TypeError('Cannot convert null or undefined to object');
      }
      const to: Record<string, unknown> = new Object(target);
      for (const source of sources) {
        for (const name of Object.keys(source)) {
          to[name] = source[name];
        }
      }
      return to;
    };
})();

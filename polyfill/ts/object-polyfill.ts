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
  function* keys(name: string, obj: Record<string, unknown>): Generator<string, void> {
    if (obj === null || obj === undefined) {
      throw new TypeError(`${name} called on non-object`);
    }

    switch (typeof obj) {
      case 'object':
        if (Symbol.isSymbol(obj)) {
          return;
        }
      case 'function':
        break;
      default:
        return;
    }

    for (const prop in obj) {
      if ((Symbol as any).isSymbol(prop)) {
        continue;
      }
      if (!hasOwnProperty.call(obj, prop)) {
        continue;
      }
      yield prop;
    }
    for (const name of dontEnums) {
      if (!hasOwnProperty.call(obj, name)) {
        continue;
      }
      yield name;
    }
  }
  function* map<T, R>(iterable: Iterable<T>, pred: (e: T) => R): Generator<R, void> {
    for (const e of iterable) {
      yield pred(e);
    }
  }
  Object.keys ??= (obj: Record<string, unknown>): string[] => [...keys('Object.keys', obj)];
  Object.entries ??= <T>(obj: Record<string, T>): [string, T][] => [
    ...map(keys('Object.entries', obj), (name): [string, T] => [name, obj[name]]),
  ];
  Object.values ??= <T>(obj: Record<string, T>): T[] => [...map(keys('Object.values', obj), name => obj[name])];

  Object.fromEntries ??= (entries: [string, unknown][]) =>
    entries.reduce<Record<string, unknown>>((r, [name, value]) => ((r[name] = value), r), {});

  Object.create ??= <T>(proto: object | null, propertiesObject?: PropertyDescriptorMap & ThisType<T>) => {
    if (typeof proto !== 'object' && typeof proto !== 'function') {
      throw new TypeError(`Object prototype may only be an Object: ${proto}`);
    }
    if (proto === null) {
      throw new Error(`This Object.create is a shim and doesn't support 'null' as the first argument.`);
    }
    if (propertiesObject !== undefined) {
      throw new Error(`This Object.create is a shim and doesn't support a second argument.`);
    }

    class F {}
    F.prototype = proto;
    if (typeof proto === 'function') {
      // functionのtoStringはthisが関数でないとエラーになるので差し替え
      const originalToString = proto.toString;
      proto.toString = () => originalToString.call(proto);
    }
    return new F();
  };
  Object.assign ??= (target: Record<string, unknown>, ...sources: Record<string, unknown>[]) => {
    if (target == null) {
      throw new TypeError('Cannot convert null or undefined to object');
    }
    const to = new Object(target) as Record<string, unknown>;
    for (const source of sources) {
      for (const name of Object.keys(source)) {
        to[name] = source[name];
      }
    }
    return to;
  };
})();

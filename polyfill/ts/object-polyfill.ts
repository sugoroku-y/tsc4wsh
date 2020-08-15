// tslint:disable-next-line:interface-name
// tslint:disable-next-line:interface-name
interface SymbolConstructor {
  isSymbol(symbol: any): boolean;
}

Object.keys =
  Object.keys ||
  (function(this: any) {
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    const hasDontEnumBug = !{toString: null}.propertyIsEnumerable('toString');
    const dontEnums = [
      'toString',
      'toLocaleString',
      'valueOf',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'constructor',
    ];

    return (obj: any) => {
      if (
        typeof obj !== 'function' &&
        (typeof obj !== 'object' || obj === null)
      ) {
        throw new TypeError('Object.keys called on non-object');
      }

      const result = [];
      for (const prop in obj) {
        if (Symbol.isSymbol(prop)) {
          continue;
        }
        if (!hasOwnProperty.call(obj, prop)) {
          continue;
        }
        result.push(prop);
      }

      if (hasDontEnumBug) {
        for (const name of dontEnums) {
          if (!hasOwnProperty.call(obj, name)) {
            continue;
          }
          result.push(name);
        }
      }
      return result;
    };
  })();
Object.entries =
  Object.entries ||
  function entries(obj: any) {
    return Object.keys(obj).map<[string, any]>(key => [key, obj[key]]);
  };
Object.values =
  Object.values ||
  function values(obj: any) {
    return Object.keys(obj).map(key => obj[key]);
  };
Object.create =
  Object.create ||
  function create(proto: any, propertiesObject?: any) {
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

    // tslint:disable-next-line: no-empty
    const F = function() {};
    F.prototype = proto;
    return new (F as any)();
  };
Object.assign =
  Object.assign ||
  function assign(target: any, ...sources: any[]) {
    if (target == null) {
      throw new TypeError('Cannot convert null or undefined to object');
    }
    const to: {[name: string]: any} = new Object(target);
    for (const source of sources) {
      for (const name of Object.keys(source)) {
        to[name] = source[name];
      }
    }
    return to;
  };

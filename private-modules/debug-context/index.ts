/**
 * WSHのErrorオブジェクトに存在するプロパティを追加
 *
 * @interface Error
 */
interface Error {
  number: number;
  description: string;
  message: string;
}

namespace debugContext {
  export function toHexadecimal(n: number, digit: number): string {
    let buf = '';
    while (digit > 4) {
      const sft = (((digit - 1) / 4) | 0) * 4;
      buf += ((n >> (sft * 4)) & ((1 << ((digit - sft) * 4)) - 1))
        .toString(16)
        .padStart(digit - sft, '0');
      digit = sft;
      n &= (1 << (digit * 4)) - 1;
    }
    return buf + n.toString(16).padStart(digit, '0');
  }
  function quote(s: string, q: '"' | "'" = '"'): string {
    return (
      q +
      s.replace(/["\\\x00-\x1f\x7f]/g, ch => {
        if (ch === q) {
          return '\\' + q;
        }
        switch (ch) {
          case '\r':
            return '\\r';
          case '\n':
            return '\\n';
          case '\t':
            return '\\t';
          case '\\':
            return '\\\\';
          case '\t':
            return '\\t';
        }
        return '\\x' + toHexadecimal(ch.charCodeAt(0), 2);
      }) +
      q
    );
  }
  function getFunctionName(f: Function) {
    return (
      (f.toString().match(/\bfunction\s+([^\s()]+)\s*\(/) || [])[1] ||
      '[anonymous]'
    );
  }
  function inspect(obj: any): string {
    return (function sub(o: any, depth: number, stack: any[]): string {
      const d = depth || 0;
      if (typeof o === 'string') {
        return quote(o);
      }
      if (typeof o === 'number') {
        return o ? '' + o : Infinity / o > 0 ? '0' : '-0';
      }
      if (!o || o === true) {
        return '' + o;
      }
      if (typeof o === 'function') {
        return `function ${getFunctionName(o)} () {...}`;
      }
      if (Array.isArray(o)) {
        if (o.length === 0) {
          return '[]';
        }
        if (stack.includes(o)) {
          return '[...]';
        }
        const [prefix, suffix, ePrefix, eSuffix, separator] =
          o.length <= 3
            ? ['[',                     ']', '',                 '',    ', ']
            : ['[\n', '  '.repeat(d) + ']', '  '.repeat(d + 1), ',\n', ''];
        return (
          prefix +
          o
            .map(e => ePrefix + sub(e, d + 1, stack.concat(o)) + eSuffix)
            .join(separator) +
          suffix
        );
      }
      if (o instanceof Error) {
        return `[Error {number: 0x${toHexadecimal(
          o.number,
          8
        )}, description: ${quote(o.description)}, message: ${quote(
          o.message
        )}}]`;
      }
      if (o instanceof RegExp) {
        return o.toString();
      }
      if (o instanceof Date) {
        return `[Date ${o.toISOString()}]`;
      }
      const names = Object.keys(o);
      if (names.length === 0) {
        return '{}';
      }
      if (stack.includes(o)) {
        return '{...}';
      }
      {
        const [prefix, suffix, ePrefix, eSuffix, separator] =
          names.length <= 3
          ? ['{',                    '}', '',                 '',    ', ']
            : ['{\n', '  '.repeat(d) + '}', '  '.repeat(d + 1), ',\n', ''];
        return (
          prefix +
          Object.keys(o)
            .map(n =>
              ePrefix + /^\w+$/.test(n)
                ? n
                : quote(n) + ': ' + sub(o[n], d + 1, stack.concat(o)) + eSuffix
            )
            .join(separator) +
          suffix
        );
      }
    })(obj, 0, []);
  }
  export function breakpoint() {
    while (true) {
      WScript.StdOut.Write('> ');
      if (WScript.StdIn.AtEndOfStream) {
        break;
      }
      const expr = WScript.StdIn.ReadLine();
      if (/^\s*:continue\s*$/.test(expr)) {
        break;
      }
      if (/^\s*:stack\s*$/.test(expr)) {
        for (
          let frame = arguments.callee.caller.caller;
          frame;
          frame = frame.caller
        ) {
          WScript.StdOut.WriteLine(
            `function ${getFunctionName(frame)} (${inspect(
              Array.from(frame.arguments)
            ).replace(/^\[|\]$/g, '')}) {...}`
          );
        }
        continue;
      }
      if (/^\s*:quit\s*$/.test(expr)) {
        WScript.Quit(1);
      }
      try {
        WScript.StdOut.WriteLine(inspect(eval(expr)));
      } catch (e) {
        WScript.StdOut.WriteLine(
          typeof e === 'object' && e && 'number' in e && typeof e.number === 'number' && 'description' in e ?
          `Error Code: 0x${toHexadecimal(e.number, 8)}: ${e.description}`
            : String(e)
        );
      }
    }
  }
}

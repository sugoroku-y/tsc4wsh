import * as fs from "fs";
import * as path from "path";

namespace optionalist {
  /**
   * 各パラメーターの説明文を取得するためのシンボル。
   */
  export const helpString: unique symbol = Symbol('helpstring');
  /**
   * 名前付きパラメーター以外のパラメーターの配列を取得するためのシンボル。
   */
  export const unnamed: unique symbol = Symbol('unnamed');

  interface OptionInformationBase {
    /**
     * オプションの型。boolean、number、stringのいずれかを指定。省略時にはstringが指定されたものとする。
     */
    type?: 'number' | 'boolean' | 'string';
    /**
     * オプションが省略されたときの値。
     */
    default?: number | string;
    /**
     * オプションの説明で使用されるパラメーターの名前。  
     * 省略時は'parameter'を使用する。
     */
    example?: string;
    /**
     * 別名。1文字だけの場合はprefixとして'-'が付き、2文字以上なら'--‘が付く
     */
    alias?: string | string[];
    /**
     * オプションの説明。すべてのオプションの説明は[optionalist.helpString]で取得できる。
     */
    describe?: string;
    /**
     * オプションが単独で指定されるもののときにtrueを指定する。
     */
    alone?: true;
    /**
     * オプションが省略不可であるときにtrueを指定する。
     */
    required?: true | undefined;
  }
  interface OptionInformationNumber extends OptionInformationBase {
    type: 'number';
    default?: number;
    example?: string;
  }
  interface OptionInformationString extends OptionInformationBase {
    type?: 'string';
    default?: string;
    example?: string;
  }
  interface OptionInformationBoolean extends OptionInformationBase {
    type: 'boolean';
    default?: never;
    example?: never;
  }
  type OptionInformation = OptionInformationString | OptionInformationNumber | OptionInformationBoolean;
  type OptionInformationMap = {
    [name: string]: OptionInformation;
  } & {
    /**
     * 名前無しパラメーターの説明などを指定する。
     */
    [unnamed]?: {
      /**
       * コマンドラインオプションの説明で使用するパラメーターの名前。
       */
      example?: string;
      /**
       * 名前無しパラメーターの説明。
       */
      describe?: string;
      /**
       * 名前無しパラメーターの最小個数。
       */
      min?: number;
      /**
       * 名前無しパラメーターの最大個数。
       */
      max?: number;
    };
    /**
     * このコマンドの説明などを指定する。
     */
    [helpString]?: {
      describ?: string;
      showUsageOnError?: true;
    };
  };
  type OptionType<
    type extends OptionInformation['type']
  > = type extends 'boolean'
    ? true
    : type extends 'number'
    ? number
    : string;

  interface OptionsBase {
    [unnamed]: string[];
    [helpString]: string;
  }
  type Options<OPTMAP extends OptionInformationMap> = OptionsBase &
    {[N in keyof OPTMAP]?: OptionType<OPTMAP[N]['type']>};

  /**
   * コマンドラインパラメーターをoptMapにしたがってパースする。
   * @param optMap
   * @param args
   */
  export function parse<OptMap extends OptionInformationMap>(
    optMap: OptMap,
    args?: Iterable<string>
  ): Options<OptMap> {
    try {
      const itr = args?.[Symbol.iterator]() ?? (() => {
        const itr = process.argv[Symbol.iterator]();
        itr.next();
        itr.next();
        return itr;
      })();
      const unnamedList: string[] = [];
      const options: {[name: string]: string | number | true} = {};
      const optMapAlias: {
        [name: string]: {name: string; info: OptionInformation};
      } = {};
      for (const [name, info] of Object.entries(optMap)) {
        const optArg = `${name.length > 1 ? '--' : '-'}${name}`;
        if ((info as any).default !== undefined) {
          switch (info.type) {
            case 'boolean':
              throw new Error(
                `The default value of the ${optArg} parameter cannot be specified.: ${
                  (info as any).default
                }`
              );
            case 'number':
              if (typeof info.default !== 'number') {
                throw new Error(
                  `The default value of the ${optArg} parameter must be a number.: ${
                    info.default
                  }`
                );
              }
              break;
            case undefined:
            case 'string':
              if (typeof info.default !== 'string') {
                throw new Error(
                  `The default value of the ${optArg} parameter must be a string.: ${
                    info.default
                  }`
                );
              }
              break;
            default:
              throw new Error(
                `unknown type: ${(info as any).type} for the ${optArg} parameter`
              );
          }
          options[name] = info.default;
        }
        optMapAlias[optArg] = {name, info};
        if (info.alias) {
          for (const alias of Array.isArray(info.alias) ? info.alias : [info.alias]) {
            const optAlias = `${alias.length > 1 ? '--' : '-'}${alias}`;
            optMapAlias[optAlias] = {name, info};
          }
        }
      }
      let aloneOpt: string | undefined;
      let prevOpt: string | undefined;
      const next = () => {
        const r = itr.next();
        return r.done ? undefined : r.value;
      };
      while (true) {
        const arg = next();
        if (arg === undefined) {
          break;
        }
        if (arg === '--') {
          while (true) {
            const value = next();
            if (value === undefined) {
              break;
            }
            unnamedList.push(value);
          }
          break;
        }
        if (!optMapAlias[arg]) {
          if (arg[0] === '-') {
            throw new Error(`unknown options: ${arg}`);
          }
          unnamedList.push(arg);
          continue
        }
        const {name, info} = optMapAlias[arg];
        if (aloneOpt || prevOpt && info.alone) {
          throw new Error(`${aloneOpt || arg} must be specified alone.`);
        }
        prevOpt = arg;
        if (info.alone) {
          aloneOpt = arg;
        }
        switch (info.type) {
          case 'boolean':
            options[name] = true;
            continue;
          case 'number':
            const value = next();
            if (value === undefined) {
              throw new Error(`${arg} needs a number parameter${info.example ? ' as the ' + info.example : ''}`);
            }
            if (Number.isNaN(+value)) {
              throw new Error(`${arg} needs a number parameter${info.example ? ' as the ' + info.example : ''}: ${value}`);
            }
            options[name] = +value;
            continue;
        }
        const value = next();
        if (value === undefined) {
          throw new Error(`${arg} needs a parameter${info.example ? ' as the ' + info.example : ''}`);
        }
        options[name] = value;
      }
      return Object.defineProperties(options, {
        [unnamed]: {
          get: () => unnamedList.slice(0),
        },
        [helpString]: {
          get: () => makeHelpString(optMap),
        },
      }) as Options<OptMap>;
    } catch (ex) {
      if (optMap[helpString]?.showUsageOnError) {
        process.stderr.write(`${ex.message}\n\n${makeHelpString(optMap)}`);
        process.exit(1);
      }
      throw ex;
    }
  }
  function loadPackageJson() {
    let dirname = __dirname;
    while (true) {
      const json = (() => {
        try {
          const stat = fs.statSync(path.join(dirname, 'node_modules'));
          if (!stat.isDirectory()) {
            return undefined;
          }
          return fs.readFileSync(path.join(dirname, 'package.json'), 'utf8');
        } catch (ex) {
          if (ex.code === 'ENOENT') {
            return undefined;
          }
          throw ex;
        }
      })();
      if (json !== undefined) {
        return JSON.parse(json);
      }
      const prev = dirname;
      dirname = path.dirname(dirname);
      if (dirname === prev) {
        // 見つからなかったらundefined
        return undefined;
      }
    }

  }
  function makeHelpString<OptMap extends OptionInformationMap>(optMap: OptMap): string { 
    const {version, name: processName} = loadPackageJson() || {};
    let help = `Version: ${processName} ${version}\nUsage:\n`;
    const requireds: string[] = [];
    const options: string[] = [];
    const alones: string[] = [];
    for (const [name, info] of Object.entries(optMap)) {
      const example = `${name.length > 1 ? '--' : '-'}${name}${info.type === 'boolean' ? '' : ' ' + (info.example || 'parameter')}`;
      (info.alone ? alones : info.required ? requireds : options).push(example);
    }
    if (requireds.length + options.length > 0) {
      const line = [...requireds, ...options.map(o => `[${o}]`)];
      const info = optMap[unnamed];
      if (info) {
        line.push(`[--] [${info.example || 'parameter'}...]`);
      }
      alones.unshift(line.join(' '));
    }
    help += alones.map(option => `  npx ${processName} ${option}\n`).join('');
    {
      const info = optMap[helpString];
      if (info?.describ) {
        help += `\nDescription:\n${indent(info.describ, '  ')}`;
      }
    }
    help += '\nOptions:\n';
    for (const [name, info] of Object.entries(optMap)) {
      const optNames = [name];
      if (info.alias) {
        if (Array.isArray(info.alias)) {
          optNames.push(...info.alias);
        } else {
          optNames.push(info.alias);
        }
      }
      help += `  ${optNames
          .map(n => `${n.length > 1 ? '--' : '-'}${n}`)
          .join(', ')}${info.type === 'boolean' ? '' : ' ' + (info.example || 'parameter')}\n${indent(info.describe, '    ')}`
    }
    const info = optMap[unnamed];
    if (info) {
      help += `  [--] [${info.example || 'parameter'}...]\n${indent(info.describe, '    ')}`
    }
    return help;
  }
  function indent(text: string | undefined, indent: string): string {
    if (!text) {
      return '';
    }
    // 行末の空白を除去しつつ一行ごとに分割
    const lines = text.split(/[ \t]*\r?\n/);
    // 先頭、末尾の空行を削除
    while (lines.length > 0 && !lines[0]) {
      lines.shift();
    }
    while (lines.length > 0 && !lines[lines.length - 1]) {
      --lines.length;
    }
    // 何もなくなったら空文字列
    if (!lines.length) {
      return '';
    }
    // 行頭の空白で共通のものを抽出
    let srcIindent: number | undefined;
    for (const line of lines) {
      const [current] = line.match(/^[ \t]+/) || [];
      if (!current) {
        srcIindent = 0;
      } else if (srcIindent === undefined) {
        srcIindent = current.length;
      } else {
        for (let l = Math.min(srcIindent, current.length); l >= 0; --l) {
          if (lines[0].slice(0, l) === line.slice(0, l)) {
            srcIindent = l;
            break;
          }
        }
      }
      if (!srcIindent) {
        break;
      }
    }
    // 各行頭に共通の空白文字があれば、共通部分だけを指定されたインデントと置き換え
    // なければ、行頭の空白文字をすべて除去して指定されたインデントを入れる
    const re = srcIindent && srcIindent > 0 ? new RegExp(`^${lines[0].slice(0, srcIindent)}`) : /^[ \t]*/;
    return lines.map(line => line.replace(re, indent) + '\n').join('')
  }
}

export default optionalist;

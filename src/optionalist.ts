namespace optionalist {
  /**
   * 各パラメーターの説明文を取得するためのシンボル。
   */
  export const helpString: unique symbol = Symbol('helpstring');
  /**
   * 名前付きパラメーター以外のパラメーターの配列を取得するためのシンボル。
   */
  export const unnamed: unique symbol = Symbol('unnamed');

  interface OptionInformation {
    alias?: string | string[];
    describe?: string;
    type?: 'boolean' | 'number' | 'string';
    default?: number | string;
  }
  type OptionInformationMap = {
    [name: string]: OptionInformation;
  };
  type OptionType<
    type extends OptionInformation['type']
  > = type extends 'boolean'
    ? boolean
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
    args?: string[]
  ): Options<OptMap> {
    if (!args) {
      args = process.argv.slice(2);
    }
    const unnamedList: string[] = [];
    const {options, optMapAlias} = Object.entries(optMap).reduce(
      (r, [name, info]) => {
        if (info.default !== undefined) {
          switch (info.type) {
            case 'boolean':
              throw new Error(
                `The default value of the --${name} parameter cannot be specified.: ${
                  info.default
                }`
              );
            case 'number':
              if (typeof info.default !== 'number') {
                throw new Error(
                  `The default value of the --${name} parameter must be a number.: ${
                    info.default
                  }`
                );
              }
              break;
            case undefined:
            case 'string':
              if (typeof info.default !== 'string') {
                throw new Error(
                  `The default value of the --${name} parameter must be a string.: ${
                    info.default
                  }`
                );
              }
              break;
            default:
              throw new Error(
                `unknown type: ${info.type} for the --${name} parameter`
              );
          }
          r.options[name] = info.default;
        }
        r.optMapAlias[name] = {name, info};
        if (info.alias) {
          if (Array.isArray(info.alias)) {
            for (const a of info.alias) {
              r.optMapAlias[a] = {name, info};
            }
          } else {
            r.optMapAlias[info.alias] = {name, info};
          }
        }
        return r;
      },
      {
        options: {} as {[name: string]: string | number | true},
        optMapAlias: {} as {
          [name: string]: {name: string; info: OptionInformation};
        },
      }
    );
    for (let i = 0; i < args.length; ++i) {
      const arg = args[i];
      if (arg === '--') {
        unnamedList.push(...args.slice(i + 1));
        break;
      }
      if (arg[0] === '-') {
        const param = arg.slice(arg[1] === '-' ? 2 : 1);
        if (optMapAlias[param]) {
          const {name, info} = optMapAlias[param];
          switch (info.type) {
            case 'boolean':
              options[name] = true;
              continue;
            case 'number':
              if (i + 1 >= args.length) {
                throw new Error(`${arg} needs a number parameter`);
              }
              const value = +args[++i];
              if (Number.isNaN(value)) {
                throw new Error(`${arg} needs a number parameter: ${args[i]}`);
              }
              options[name] = value;
              continue;
          }
          if (i + 1 >= args.length) {
            throw new Error(`${arg} needs a parameter`);
          }
          ++i;
          options[name] = args[i];
          continue;
        }
        throw new Error(`unknown options: ${arg}`);
      }
      unnamedList.push(arg);
    }
    return Object.defineProperties(options, {
      [unnamed]: {
        get: () => unnamedList,
      },
      [helpString]: {
        get: () =>
          Object.entries(optMap).reduce((helpString, [name, info]) => {
            const optNames = [name];
            if (info.alias) {
              if (Array.isArray(info.alias)) {
                optNames.push(...info.alias);
              } else {
                optNames.push(info.alias);
              }
            }
            return (
              helpString +
              `  ${optNames.map((n) => `-${n}`).join(', ')} ${info.describe ||
                ''}\n`
            );
          }, 'Options:\n'),
      },
    }) as Options<OptMap>;
  }
}

export default optionalist;

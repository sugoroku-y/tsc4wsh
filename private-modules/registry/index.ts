// activex-interopではメソッドが定義されていないので追加
// tslint:disable-next-line:interface-name
interface SafeArray<T> {
  toArray(): T[];
  dimensions(): number;
  getItem(index: number): T;
  lbound(dimension: number): number;
  ubound(dimension: number): number;
}

namespace WbemScripting {
  export interface ISWbemLocator {
    ConnectServer(
      server?: string,
      nameSpace?: string,
      user?: string,
      password?: string,
      locale?: string,
      authority?: string,
      securityFlags?: number,
      wbemNamedValueSet?: any
    ): ISWbemServices;
  }
  export interface ISWbemServices {
    Get(
      ObjectPath?: string,
      iFlags?: number,
      wbemNamedValueSet?: any
    ): ISWbemObject;
  }
  export interface ISWbemObject {
    Methods_: ISWbemMethodSet;
    ExecMethod_<T extends {[name: string]: any}>(
      methodName: string,
      wbemInParams?: ISWbemObject,
      flags?: number,
      wbemNamedValueSet?: any
    ): ISWbemObject & T;
    SpawnInstance_<T extends {[name: string]: any}>(
      flags?: number
    ): ISWbemObject & T;
  }

  export interface ISWbemMethodSet {
    readonly Count: number;
    Item(name: string, flags?: number): ISWbemMethod;
  }
  export interface ISWbemMethod {
    InParameters: ISWbemObject;
    Name: string;
    OutParameters: any;
  }
}

// tslint:disable-next-line:interface-name
interface ActiveXObjectNameMap {
  'WbemScripting.SWbemLocator': WbemScripting.ISWbemLocator;
}

enum RegRoot {
  HKEY_CLASSES_ROOT = 0x80000000,
  HKEY_CURRENT_USER = 0x80000001,
  HKEY_LOCAL_MACHINE = 0x80000002,
  HKEY_USERS = 0x80000003,
  HKEY_CURRENT_CONFIG = 0x80000005,
  HKEY_DYN_DATA = 0x80000006,
  HKCU = HKEY_CURRENT_USER,
  HKLM = HKEY_LOCAL_MACHINE,
  HKCR = HKEY_CLASSES_ROOT,
  HKU = HKEY_USERS,
  HKCC = HKEY_CURRENT_CONFIG,
}
function parseRegRoot(name: string) {
  if (!(name in RegRoot)) {
    throw new Error(`Unknown registry root: ${name}`);
  }
  return RegRoot[name as keyof typeof RegRoot];
}

enum RegType {
  REG_SZ = 1,
  REG_EXPAND_SZ = 2,
  REG_BINARY = 3,
  REG_DWORD = 4,
  REG_MULTI_SZ = 7,
  REG_QWORD = 11,
}
function parseRegType(name: string) {
  if (!(name in RegType)) {
    throw new Error(`Unknown registry type: ${name}`);
  }
  return RegType[name as keyof typeof RegType & string];
}

const enum RegDesired {
  // Required to query the values of a registry key.
  KEY_QUERY_VALUE = 0x01,
  // Required to create, delete, or set a registry value.
  KEY_SET_VALUE = 0x02,
  // Required to create a subkey of a registry key.
  KEY_CREATE_SUB_KEY = 0x04,
  // Required to enumerate the subkeys of a registry key.
  KEY_ENUMERATE_SUB_KEYS = 0x08,
  // Required to request change notifications for a registry key or for subkeys of a registry key.
  KEY_NOTIFY = 0x10,
  // Required to create a registry key.
  KEY_CREATE = 0x20,
  // Required to delete a registry key.
  DELETE = 0x10000,
  // Combines the STANDARD_RIGHTS_READ, KEY_QUERY_VALUE, KEY_ENUMERATE_SUB_KEYS, and KEY_NOTIFY values.
  READ_CONTROL = 0x20000,
  // Required to modify the DACL in the object's security descriptor.
  WRITE_DAC = 0x40000,
  // Required to change the owner in the object's security descriptor.
  WRITE_OWNER = 0x80000,
}

function toSafeArray<T>(arr: T[]) {
  return arr
    .reduce((dic, e, i) => (dic.Add(i, e), dic), WScript.CreateObject(
      'Scripting.Dictionary'
    ) as Scripting.Dictionary<number, T>)
    .Items();
}

class Registry {
  private readonly stdregprov: WbemScripting.ISWbemObject;
  constructor(computer: string = '.') {
    const locator = WScript.CreateObject('WbemScripting.SWbemLocator');
    const server = locator.ConnectServer(computer, 'root\\default');
    this.stdregprov = server.Get('StdRegProv');
  }

  public CheckAccess(
    hDefKey: RegRoot,
    sSubKeyName: string,
    uRequired?: RegDesired
  ): boolean | undefined {
    const r = this.callMethod<{uRequired?: RegDesired}, {bGranted: boolean}>(
      'CheckAccess',
      {hDefKey, sSubKeyName, uRequired}
    );
    return (r && r.bGranted) || undefined;
  }

  public CreateKey(hDefKey: RegRoot, sSubKeyName: string) {
    this.callMethod('CreateKey', {hDefKey, sSubKeyName});
  }

  public DeleteKey(hDefKey: RegRoot, sSubKeyName: string) {
    this.callMethod('DeleteKey', {hDefKey, sSubKeyName});
  }

  public DeleteValue(
    hDefKey: RegRoot,
    sSubKeyName: string,
    sValueName: string
  ) {
    this.callMethod<{sValueName: typeof sValueName}>('DeleteValue', {
      hDefKey,
      sSubKeyName,
      sValueName,
    });
  }

  public EnumKey(hDefKey: RegRoot, sSubKeyName: string) {
    const out = this.callMethod<{}, {sNames: SafeArray<string> | null}>(
      'EnumKey',
      {hDefKey, sSubKeyName}
    );
    return (
      out !== null &&
      out.sNames !== null &&
      out.sNames
        .toArray()
        .map(name => ({name, low: name.toLowerCase()}))
        .sort((a, b) => (a.low < b.low ? -1 : a.low > b.low ? 1 : 0))
    );
  }

  public EnumValues(hDefKey: RegRoot, sSubKeyName: string) {
    const out = this.callMethod<
      {},
      {sNames: SafeArray<string> | null; Types: SafeArray<RegType> | null}
    >('EnumValues', {hDefKey, sSubKeyName});
    if (out === null || out.sNames === null || out.Types === null) {
      return null;
    }
    const names = out.sNames.toArray();
    const types = out.Types.toArray();
    return names
      .map((name, index) => ({
        name,
        type: types[index],
        // tslint:disable-next-line:object-literal-sort-keys
        low: name.toLowerCase(),
      }))
      .sort((a, b) => (a.low < b.low ? -1 : a.low > b.low ? 1 : 0));
  }

  public GetStringValue(
    hDefKey: RegRoot,
    sSubKeyName: string,
    sValueName: string
  ) {
    const out = this.callMethod<
      {sValueName: typeof sValueName},
      {sValue: string | null}
    >('GetStringValue', {hDefKey, sSubKeyName, sValueName});
    return out !== null ? out.sValue : undefined;
  }
  public GetExpandedStringValue(
    hDefKey: RegRoot,
    sSubKeyName: string,
    sValueName: string
  ) {
    const out = this.callMethod<
      {sValueName: typeof sValueName},
      {sValue: string | null}
    >('GetExpandedStringValue', {hDefKey, sSubKeyName, sValueName});
    return out !== null ? out.sValue : undefined;
  }
  public GetDWORDValue(
    hDefKey: RegRoot,
    sSubKeyName: string,
    sValueName: string
  ) {
    const out = this.callMethod<
      {sValueName: typeof sValueName},
      {uValue: number | null}
    >('GetDWORDValue', {hDefKey, sSubKeyName, sValueName});
    return out !== null ? out.uValue : undefined;
  }
  public GetMultiStringValue(
    hDefKey: RegRoot,
    sSubKeyName: string,
    sValueName: string
  ) {
    const out = this.callMethod<
      {sValueName: typeof sValueName},
      {sValue: SafeArray<string> | null}
    >('GetMultiStringValue', {hDefKey, sSubKeyName, sValueName});
    return out === null || out.sValue === null ? null : out.sValue.toArray();
  }
  public GetBinayValue(
    hDefKey: RegRoot,
    sSubKeyName: string,
    sValueName: string
  ) {
    const out = this.callMethod<
      {sValueName: typeof sValueName},
      {uValue: SafeArray<number> | null}
    >('GetBinaryValue', {hDefKey, sSubKeyName, sValueName});
    return out === null || out.uValue === null ? null : out.uValue.toArray();
  }
  public GetQWORDValue(
    hDefKey: RegRoot,
    sSubKeyName: string,
    sValueName: string
  ) {
    const out = this.callMethod<
      {sValueName: typeof sValueName},
      {uValue: number | null}
    >('GetQWORDValue', {hDefKey, sSubKeyName, sValueName});
    return out !== null ? out.uValue : undefined;
  }

  public SetStringValue(
    hDefKey: RegRoot,
    sSubKeyName: string,
    sValueName: string,
    sValue: string
  ) {
    this.callMethod<{sValueName: typeof sValueName; sValue: typeof sValue}>(
      'SetStringValue',
      {hDefKey, sSubKeyName, sValueName, sValue}
    );
  }
  public SetExpandedStringValue(
    hDefKey: RegRoot,
    sSubKeyName: string,
    sValueName: string,
    sValue: string
  ) {
    this.callMethod<{sValueName: typeof sValueName; sValue: typeof sValue}>(
      'SetExpandedStringValue',
      {hDefKey, sSubKeyName, sValueName, sValue}
    );
  }
  public SetDWORDValue(
    hDefKey: RegRoot,
    sSubKeyName: string,
    sValueName: string,
    uValue: number
  ) {
    this.callMethod<{sValueName: typeof sValueName; uValue: typeof uValue}>(
      'SetDWORDValue',
      {hDefKey, sSubKeyName, sValueName, uValue}
    );
  }
  public SetMultiStringValue(
    hDefKey: RegRoot,
    sSubKeyName: string,
    sValueName: string,
    sValue: string[]
  ) {
    this.callMethod<{
      sValueName: typeof sValueName;
      sValue: SafeArray<string>;
    }>('SetMultiStringValue', {
      hDefKey,
      sSubKeyName,
      sValueName,
      // tslint:disable-next-line:object-literal-sort-keys
      sValue: toSafeArray(sValue),
    });
  }
  public SetBinayValue(
    hDefKey: RegRoot,
    sSubKeyName: string,
    sValueName: string,
    uValue: number[]
  ) {
    this.callMethod<{
      sValueName: typeof sValueName;
      uValue: SafeArray<number>;
    }>('SetBinaryValue', {
      hDefKey,
      sSubKeyName,
      sValueName,
      uValue: toSafeArray(uValue),
    });
  }
  public SetQWORDValue(
    hDefKey: RegRoot,
    sSubKeyName: string,
    sValueName: string,
    uValue: number
  ) {
    this.callMethod<{sValueName: typeof sValueName; uValue: typeof uValue}>(
      'SetQWORDValue',
      {hDefKey, sSubKeyName, sValueName, uValue}
    );
  }

  public GetValue(
    hDefKey: RegRoot,
    sSubKeyName: string,
    sValueName: string,
    type: RegType
  ) {
    switch (type) {
      case RegType.REG_SZ:
        return this.GetStringValue(hDefKey, sSubKeyName, sValueName);
      case RegType.REG_EXPAND_SZ:
        return this.GetExpandedStringValue(hDefKey, sSubKeyName, sValueName);
      case RegType.REG_BINARY:
        return this.GetBinayValue(hDefKey, sSubKeyName, sValueName);
      case RegType.REG_DWORD:
        return this.GetDWORDValue(hDefKey, sSubKeyName, sValueName);
      case RegType.REG_MULTI_SZ:
        return this.GetMultiStringValue(hDefKey, sSubKeyName, sValueName);
      case RegType.REG_QWORD:
        return this.GetQWORDValue(hDefKey, sSubKeyName, sValueName);
    }
  }
  public SetValue(
    hDefKey: RegRoot,
    sSubKeyName: string,
    sValueName: string,
    value: string,
    type: RegType.REG_SZ | RegType.REG_EXPAND_SZ
  ): void;
  public SetValue(
    hDefKey: RegRoot,
    sSubKeyName: string,
    sValueName: string,
    value: number[],
    type: RegType.REG_BINARY
  ): void;
  public SetValue(
    hDefKey: RegRoot,
    sSubKeyName: string,
    sValueName: string,
    value: number,
    type: RegType.REG_DWORD | RegType.REG_QWORD
  ): void;
  public SetValue(
    hDefKey: RegRoot,
    sSubKeyName: string,
    sValueName: string,
    value: string[],
    type: RegType.REG_MULTI_SZ
  ): void;
  public SetValue(
    hDefKey: RegRoot,
    sSubKeyName: string,
    sValueName: string,
    value: number | string | string[] | number[]
  ): void;
  public SetValue(
    hDefKey: RegRoot,
    sSubKeyName: string,
    sValueName: string,
    value: number | string | string[] | number[],
    type?: RegType
  ) {
    if (type === undefined) {
      type = (() => {
        switch (typeof value) {
          case 'string':
            return RegType.REG_SZ;
          case 'number':
            return RegType.REG_DWORD;
        }
        if (Array.isArray(value) && value.length) {
          switch (typeof value[0]) {
            case 'string':
              return RegType.REG_MULTI_SZ;
            case 'number':
              return RegType.REG_BINARY;
          }
        }
        throw new Error('Unsupported value type: ' + typeof value);
      })();
    }
    switch (type) {
      case RegType.REG_SZ:
        this.SetStringValue(hDefKey, sSubKeyName, sValueName, value as string);
        return;
      case RegType.REG_EXPAND_SZ:
        this.SetExpandedStringValue(
          hDefKey,
          sSubKeyName,
          sValueName,
          value as string
        );
        return;
      case RegType.REG_BINARY:
        this.SetBinayValue(hDefKey, sSubKeyName, sValueName, value as number[]);
        return;
      case RegType.REG_DWORD:
        this.SetDWORDValue(hDefKey, sSubKeyName, sValueName, value as number);
        return;
      case RegType.REG_MULTI_SZ:
        this.SetMultiStringValue(
          hDefKey,
          sSubKeyName,
          sValueName,
          value as string[]
        );
        return;
      case RegType.REG_QWORD:
        this.SetQWORDValue(hDefKey, sSubKeyName, sValueName, value as number);
        return;
    }
  }
  private callMethod<
    T extends {[name: string]: any} = {},
    R extends {[name: string]: any} = {}
  >(methodName: string, params: T & {hDefKey: RegRoot; sSubKeyName: string}) {
    const inParam = this.stdregprov.Methods_.Item(
      methodName
    ).InParameters.SpawnInstance_<typeof params>();
    for (const name of Object.keys(params)) {
      (inParam as any)[name] = (params as any)[name];
    }
    const out = this.stdregprov.ExecMethod_<R & {ReturnValue: number}>(
      methodName,
      inParam
    );
    if (out.ReturnValue === 2 /* ERROR_FILE_NOT_FOUND */) {
      return null;
    }
    if (out.ReturnValue !== 0) {
      throw new Error(`Error Code: ${out.ReturnValue}`);
    }
    return out;
  }
}

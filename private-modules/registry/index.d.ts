interface SafeArray<T> {
    toArray(): T[];
    dimensions(): number;
    getItem(index: number): T;
    lbound(dimension: number): number;
    ubound(dimension: number): number;
}
declare namespace WbemScripting {
    interface ISWbemLocator {
        ConnectServer(server?: string, nameSpace?: string, user?: string, password?: string, locale?: string, authority?: string, securityFlags?: number, wbemNamedValueSet?: any): ISWbemServices;
    }
    interface ISWbemServices {
        Get(ObjectPath?: string, iFlags?: number, wbemNamedValueSet?: any): ISWbemObject;
    }
    interface ISWbemObject {
        Methods_: ISWbemMethodSet;
        ExecMethod_<T extends {
            [name: string]: any;
        }>(methodName: string, wbemInParams?: ISWbemObject, flags?: number, wbemNamedValueSet?: any): ISWbemObject & T;
        SpawnInstance_<T extends {
            [name: string]: any;
        }>(flags?: number): ISWbemObject & T;
    }
    interface ISWbemMethodSet {
        readonly Count: number;
        Item(name: string, flags?: number): ISWbemMethod;
    }
    interface ISWbemMethod {
        InParameters: ISWbemObject;
        Name: string;
        OutParameters: any;
    }
}
interface ActiveXObjectNameMap {
    'WbemScripting.SWbemLocator': WbemScripting.ISWbemLocator;
}
declare enum RegRoot {
    HKEY_CLASSES_ROOT = 2147483648,
    HKEY_CURRENT_USER = 2147483649,
    HKEY_LOCAL_MACHINE = 2147483650,
    HKEY_USERS = 2147483651,
    HKEY_CURRENT_CONFIG = 2147483653,
    HKEY_DYN_DATA = 2147483654,
    HKCU = 2147483649,
    HKLM = 2147483650,
    HKCR = 2147483648,
    HKU = 2147483651,
    HKCC = 2147483653
}
declare function parseRegRoot(name: string): RegRoot;
declare enum RegType {
    REG_SZ = 1,
    REG_EXPAND_SZ = 2,
    REG_BINARY = 3,
    REG_DWORD = 4,
    REG_MULTI_SZ = 7,
    REG_QWORD = 11
}
declare function parseRegType(name: string): RegType;
declare const enum RegDesired {
    KEY_QUERY_VALUE = 1,
    KEY_SET_VALUE = 2,
    KEY_CREATE_SUB_KEY = 4,
    KEY_ENUMERATE_SUB_KEYS = 8,
    KEY_NOTIFY = 16,
    KEY_CREATE = 32,
    DELETE = 65536,
    READ_CONTROL = 131072,
    WRITE_DAC = 262144,
    WRITE_OWNER = 524288
}
declare function toSafeArray<T>(arr: T[]): SafeArray<T>;
declare class Registry {
    private readonly stdregprov;
    constructor(computer?: string);
    CheckAccess(hDefKey: RegRoot, sSubKeyName: string, uRequired?: RegDesired): boolean | undefined;
    CreateKey(hDefKey: RegRoot, sSubKeyName: string): void;
    DeleteKey(hDefKey: RegRoot, sSubKeyName: string): void;
    DeleteValue(hDefKey: RegRoot, sSubKeyName: string, sValueName: string): void;
    EnumKey(hDefKey: RegRoot, sSubKeyName: string): false | {
        name: string;
        low: string;
    }[];
    EnumValues(hDefKey: RegRoot, sSubKeyName: string): {
        name: string;
        type: RegType;
        low: string;
    }[] | null;
    GetStringValue(hDefKey: RegRoot, sSubKeyName: string, sValueName: string): string | null | undefined;
    GetExpandedStringValue(hDefKey: RegRoot, sSubKeyName: string, sValueName: string): string | null | undefined;
    GetDWORDValue(hDefKey: RegRoot, sSubKeyName: string, sValueName: string): number | null | undefined;
    GetMultiStringValue(hDefKey: RegRoot, sSubKeyName: string, sValueName: string): string[] | null;
    GetBinayValue(hDefKey: RegRoot, sSubKeyName: string, sValueName: string): number[] | null;
    GetQWORDValue(hDefKey: RegRoot, sSubKeyName: string, sValueName: string): number | null | undefined;
    SetStringValue(hDefKey: RegRoot, sSubKeyName: string, sValueName: string, sValue: string): void;
    SetExpandedStringValue(hDefKey: RegRoot, sSubKeyName: string, sValueName: string, sValue: string): void;
    SetDWORDValue(hDefKey: RegRoot, sSubKeyName: string, sValueName: string, uValue: number): void;
    SetMultiStringValue(hDefKey: RegRoot, sSubKeyName: string, sValueName: string, sValue: string[]): void;
    SetBinayValue(hDefKey: RegRoot, sSubKeyName: string, sValueName: string, uValue: number[]): void;
    SetQWORDValue(hDefKey: RegRoot, sSubKeyName: string, sValueName: string, uValue: number): void;
    GetValue(hDefKey: RegRoot, sSubKeyName: string, sValueName: string, type: RegType): string | number | string[] | number[] | null | undefined;
    SetValue(hDefKey: RegRoot, sSubKeyName: string, sValueName: string, value: string, type: RegType.REG_SZ | RegType.REG_EXPAND_SZ): void;
    SetValue(hDefKey: RegRoot, sSubKeyName: string, sValueName: string, value: number[], type: RegType.REG_BINARY): void;
    SetValue(hDefKey: RegRoot, sSubKeyName: string, sValueName: string, value: number, type: RegType.REG_DWORD | RegType.REG_QWORD): void;
    SetValue(hDefKey: RegRoot, sSubKeyName: string, sValueName: string, value: string[], type: RegType.REG_MULTI_SZ): void;
    SetValue(hDefKey: RegRoot, sSubKeyName: string, sValueName: string, value: number | string | string[] | number[]): void;
    private callMethod;
}

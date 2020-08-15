/// <reference types="msxml2" />
/// <reference types="iterables" />

//
namespace WScriptUtil {
  export namespace Arguments {
    export function Named<T = string | undefined>(
      key: string | string[],
      conv?: (v: string | undefined) => T
    ): T;
    export function Named<T = string | undefined>(params: {
      key: string | string[];
      conv?: (v: string | undefined) => T;
    }): T;
    export function Named<T = string | undefined>(
      params:
        | string
        | string[]
        | {key: string | string[]; conv?: (v: string | undefined) => T},
      convArg?: (v: string | undefined) => T
    ): T {
      const [key, conv] =
        typeof params === 'string' || Array.isArray(params)
          ? [params, convArg]
          : [params.key, params.conv];
      const keys = Array.isArray(key) ? key : [key];
      const value = (() => {
        for (const k of keys) {
          if (WScript.Arguments.Named.Exists(k)) {
            return WScript.Arguments.Named(k);
          }
        }
        return undefined;
      })();
      return conv ? conv(value) : (value as any);
    }
    export function Switch(keys: string | string[]): boolean {
      for (const key of Array.isArray(keys) ? keys : [keys]) {
        if (WScript.Arguments.Named.Exists(key)) {
          return true;
        }
      }
      return false;
    }
    export function Unnamed() {
      return Iterables.from(WScript.Arguments.Unnamed);
    }
  }

  export function validateParameters() {
    if (
      WScript.Arguments.Named.Exists('?') ||
      WScript.Arguments.Named.Exists('help')
    ) {
      WScript.Arguments.ShowUsage();
      return WScript.Quit(0);
    }

    const doc = WScript.CreateObject('Msxml2.DOMDocument.6.0');
    doc.load(WScript.ScriptFullName);
    let hasError = false;
    for (const node of Iterables.from(doc.selectNodes('/job/runtime/named'))) {
      if (node.nodeType !== MSXML2.DOMNodeType.NODE_ELEMENT) {
        continue;
      }
      const name = node.getAttribute('name');
      if (!name) {
        continue;
      }
      const required: 'true' | 'false' = node.getAttribute('required');
      if (!WScript.Arguments.Named.Exists(name)) {
        if (required) {
          WScript.Echo(`${name} は必須パラメータです。`);
          hasError = true;
        }
        continue;
      }
      const value = WScript.Arguments.Named(name);
      switch (node.getAttribute('type')) {
        case 'string':
          if (typeof value !== 'string') {
            WScript.Echo(
              `${name} には文字列を指定(/${name}:文字列)してください。`
            );
            hasError = true;
            continue;
          }
          break;
        case 'boolean':
          if (typeof value !== 'boolean') {
            WScript.Echo(
              `${name} にはオン(/${name}+)、もしくはオフ(/${name}-)を指定してください。`
            );
            hasError = true;
            continue;
          }
          break;
        default:
          // case 'simple':
          if (typeof value !== 'undefined') {
            WScript.Echo(
              `${name} にはパラメータだけ(/${name})を指定してください。`
            );
            hasError = true;
            continue;
          }
          break;
      }
    }
    const unnamedElement = doc.selectSingleNode('/job/runtime/unnamed');
    if (
      unnamedElement &&
      unnamedElement.nodeType === MSXML2.DOMNodeType.NODE_ELEMENT
    ) {
      const isMany = unnamedElement.getAttribute('many') === 'true';
      const required = (value =>
        !value ? 0 : value === 'true' ? 1 : value === 'false' ? 0 : +value)(
        unnamedElement.getAttribute('required')
      );
      if (WScript.Arguments.Unnamed.length < required) {
        WScript.Echo(`パラメータが不足しています(必要数: ${required}})。`);
        hasError = true;
      } else if (WScript.Arguments.Unnamed.length > required && !isMany) {
        WScript.Echo(
          required > 0
            ? `パラメータが多過ぎます(必要数: ${required}})。`
            : `パラメータは不要です。`
        );
        hasError = true;
      }
    }
    if (hasError) {
      return WScript.Quit(1);
    }
  }
}

declare namespace WScriptUtil {
    namespace Arguments {
        function Named<T = string | undefined>(key: string | string[], conv?: (v: string | undefined) => T): T;
        function Named<T = string | undefined>(params: {
            key: string | string[];
            conv?: (v: string | undefined) => T;
        }): T;
        function Switch(keys: string | string[]): boolean;
        function Unnamed(): Iterable<string>;
    }
    function validateParameters(): number;
}

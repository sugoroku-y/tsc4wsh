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
declare namespace debugContext {
    function toHexadecimal(n: number, digit: number): string;
    function breakpoint(): void;
}

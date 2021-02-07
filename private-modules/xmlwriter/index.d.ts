/// <reference types="../@types/dom3" />
interface RegExpConstructor {
    lastIndex: number;
    lastParen: string;
    leftContext: string;
    rightContext: string;
    ['$`']: string;
    ["$'"]: string;
    ['$&']: string;
    ['$+']: string;
}
declare namespace XmlWriter {
    function writeToFileByUtf8N(content: string, filepath: string): void;
    function toXml(doc: DOM3.Document, options?: {
        indent?: number | boolean | {
            hardTab?: boolean;
            count?: number;
        };
        xmldecl?: boolean;
        encoding?: string;
        standalone?: boolean;
    }): string;
}

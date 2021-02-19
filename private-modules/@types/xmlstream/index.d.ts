declare namespace XMLStream {
  interface Locator {
    readonly columnNumber: number;
    readonly lineNumber: number;
    readonly publicId: string;
    readonly systemId: string;
  }
  interface Attributes {
    getIndexFromName(uri: string, localName: string): number;
    getIndexFromQName(qname: string): number;
    getLocalName(index: number): string;
    getQName(index: number): string;
    getType(index: number): string;
    getTypeFromName(uri: string, localName: string): string;
    getTypeFromQName(qname: string): string;
    getURI(index: number): string;
    getValue(index: number): string;
    getValueFromName(uri: string, localName: string): string;
    getValueFromQName(qname: string): string;
    readonly length: number;
  }
  interface ContentHandler {
    characters(chars: string): void;
    readonly documentLocator: Locator;
    endDocument(): void;
    endElement(namespaceURI: string, localName: string, qname: string): void;
    endPrefixMapping(prefix: string): void;
    ignorableWhitespace(chars: string): void;
    processingInstruction(target: string, data: string): void;
    skippedEntity(name: string): void;
    startDocument(): void;
    startElement(
      namespaceURI: string,
      localName: string,
      qname: string,
      attributes: Attributes
    ): void;
    startPrefixMapping(prefix: string, uri: string): void;
  }
  interface Writer extends ContentHandler {
    byteOrderMark: boolean;
    disableOutputEscaping: boolean;
    encoding: string;
    flush(): void;
    indent: boolean;
    omitXMLDeclaration: boolean;
    output: string;
    standalone: boolean;
    version: string;
  }
  interface DTDHandler {
    notationDecl(name: string, publicId: string, systemId: string): void;
    unparsedEntityDecl(
      name: string,
      publicId: string,
      systemId: string,
      notationName: string
    ): void;
  }
  interface EntityResolver {
    resolveEntity(publicId: string, systemId: string): any;
  }
  interface ErrorHandler {
    error(locator: Locator, errorMessage: string, errorCode: number): void;
    fatalError(locator: Locator, errorMessage: string, errorCode: number): void;
    ignorableWarning(
      locator: Locator,
      errorMessage: string,
      errorCode: number
    ): void;
  }
  interface Reader {
    baseURL: string;
    contentHandler: ContentHandler;
    dtdHandler: DTDHandler;
    entityResolver: EntityResolver;
    errorHandler: ErrorHandler;
    getFeature(name: string): boolean;
    getProperty(name: string): any;
    parse(input: string): void;
    parseURL(url: string): void;
    putFeature(name: string, state: boolean): void;
    putProperty(name: string, value: any): void;
    secureBaseURL: string;
  }
}

interface ActiveXObjectNameMap {
  'MSXML2.MXXMLWriter': XMLStream.Writer;
  'MSXML2.SAXXMLReader': XMLStream.Reader;
}

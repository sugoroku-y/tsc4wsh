// Type definitions for Microsoft XML, v6.0 - MSXML2 6.0
// Project: https://msdn.microsoft.com/en-us/library/ms763742.aspx
// Definitions by: Zev Spitz <https://github.com/zspitz>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.6

/// <reference types="activex-interop" />

declare namespace MSXML2 {
  /** Schema Object Model Content Types */
  const enum SCHEMACONTENTTYPE {
    SCHEMACONTENTTYPE_EMPTY = 0,
    SCHEMACONTENTTYPE_TEXTONLY = 1,
    SCHEMACONTENTTYPE_ELEMENTONLY = 2,
    SCHEMACONTENTTYPE_MIXED = 3,
  }

  /** Schema Object Model Filters */
  const enum SCHEMADERIVATIONMETHOD {
    SCHEMADERIVATIONMETHOD_EMPTY = 0,
    SCHEMADERIVATIONMETHOD_SUBSTITUTION = 1,
    SCHEMADERIVATIONMETHOD_EXTENSION = 2,
    SCHEMADERIVATIONMETHOD_RESTRICTION = 4,
    SCHEMADERIVATIONMETHOD_LIST = 8,
    SCHEMADERIVATIONMETHOD_UNION = 16,
    SCHEMADERIVATIONMETHOD_ALL = 255,
    SCHEMADERIVATIONMETHOD_NONE = 256,
  }

  /** Schema Object Model Process Contents */
  const enum SCHEMAPROCESSCONTENTS {
    SCHEMAPROCESSCONTENTS_NONE = 0,
    SCHEMAPROCESSCONTENTS_SKIP = 1,
    SCHEMAPROCESSCONTENTS_LAX = 2,
    SCHEMAPROCESSCONTENTS_STRICT = 3,
  }

  /** Schema Object Model Type variety values */
  const enum SCHEMATYPEVARIETY {
    SCHEMATYPEVARIETY_NONE = -1,
    SCHEMATYPEVARIETY_ATOMIC = 0,
    SCHEMATYPEVARIETY_LIST = 1,
    SCHEMATYPEVARIETY_UNION = 2,
  }

  /** Schema Object Model Attribute Uses */
  const enum SCHEMAUSE {
    SCHEMAUSE_OPTIONAL = 0,
    SCHEMAUSE_PROHIBITED = 1,
    SCHEMAUSE_REQUIRED = 2,
  }

  /** Schema Object Model Whitespace facet values */
  const enum SCHEMAWHITESPACE {
    SCHEMAWHITESPACE_NONE = -1,
    SCHEMAWHITESPACE_PRESERVE = 0,
    SCHEMAWHITESPACE_REPLACE = 1,
    SCHEMAWHITESPACE_COLLAPSE = 2,
  }

  const enum SERVERXMLHTTP_OPTION {
    SXH_OPTION_URL = -1,
    SXH_OPTION_URL_CODEPAGE = 0,
    SXH_OPTION_ESCAPE_PERCENT_IN_URL = 1,
    SXH_OPTION_IGNORE_SERVER_SSL_CERT_ERROR_FLAGS = 2,
    SXH_OPTION_SELECT_CLIENT_SSL_CERT = 3,
  }

  /** Schema Object Model Item Types */
  const enum SOMITEMTYPE {
    SOMITEM_NULL = 2048,
    SOMITEM_SCHEMA = 4096,
    SOMITEM_ATTRIBUTE = 4097,
    SOMITEM_ATTRIBUTEGROUP = 4098,
    SOMITEM_NOTATION = 4099,
    SOMITEM_ANNOTATION = 4100,
    SOMITEM_IDENTITYCONSTRAINT = 4352,
    SOMITEM_KEY = 4353,
    SOMITEM_KEYREF = 4354,
    SOMITEM_UNIQUE = 4355,
    SOMITEM_ANYTYPE = 8192,
    SOMITEM_DATATYPE = 8448,
    SOMITEM_DATATYPE_ANYTYPE = 8449,
    SOMITEM_DATATYPE_ANYURI = 8450,
    SOMITEM_DATATYPE_BASE64BINARY = 8451,
    SOMITEM_DATATYPE_BOOLEAN = 8452,
    SOMITEM_DATATYPE_BYTE = 8453,
    SOMITEM_DATATYPE_DATE = 8454,
    SOMITEM_DATATYPE_DATETIME = 8455,
    SOMITEM_DATATYPE_DAY = 8456,
    SOMITEM_DATATYPE_DECIMAL = 8457,
    SOMITEM_DATATYPE_DOUBLE = 8458,
    SOMITEM_DATATYPE_DURATION = 8459,
    SOMITEM_DATATYPE_ENTITIES = 8460,
    SOMITEM_DATATYPE_ENTITY = 8461,
    SOMITEM_DATATYPE_FLOAT = 8462,
    SOMITEM_DATATYPE_HEXBINARY = 8463,
    SOMITEM_DATATYPE_ID = 8464,
    SOMITEM_DATATYPE_IDREF = 8465,
    SOMITEM_DATATYPE_IDREFS = 8466,
    SOMITEM_DATATYPE_INT = 8467,
    SOMITEM_DATATYPE_INTEGER = 8468,
    SOMITEM_DATATYPE_LANGUAGE = 8469,
    SOMITEM_DATATYPE_LONG = 8470,
    SOMITEM_DATATYPE_MONTH = 8471,
    SOMITEM_DATATYPE_MONTHDAY = 8472,
    SOMITEM_DATATYPE_NAME = 8473,
    SOMITEM_DATATYPE_NCNAME = 8474,
    SOMITEM_DATATYPE_NEGATIVEINTEGER = 8475,
    SOMITEM_DATATYPE_NMTOKEN = 8476,
    SOMITEM_DATATYPE_NMTOKENS = 8477,
    SOMITEM_DATATYPE_NONNEGATIVEINTEGER = 8478,
    SOMITEM_DATATYPE_NONPOSITIVEINTEGER = 8479,
    SOMITEM_DATATYPE_NORMALIZEDSTRING = 8480,
    SOMITEM_DATATYPE_NOTATION = 8481,
    SOMITEM_DATATYPE_POSITIVEINTEGER = 8482,
    SOMITEM_DATATYPE_QNAME = 8483,
    SOMITEM_DATATYPE_SHORT = 8484,
    SOMITEM_DATATYPE_STRING = 8485,
    SOMITEM_DATATYPE_TIME = 8486,
    SOMITEM_DATATYPE_TOKEN = 8487,
    SOMITEM_DATATYPE_UNSIGNEDBYTE = 8488,
    SOMITEM_DATATYPE_UNSIGNEDINT = 8489,
    SOMITEM_DATATYPE_UNSIGNEDLONG = 8490,
    SOMITEM_DATATYPE_UNSIGNEDSHORT = 8491,
    SOMITEM_DATATYPE_YEAR = 8492,
    SOMITEM_DATATYPE_YEARMONTH = 8493,
    SOMITEM_DATATYPE_ANYSIMPLETYPE = 8703,
    SOMITEM_SIMPLETYPE = 8704,
    SOMITEM_COMPLEXTYPE = 9216,
    SOMITEM_NULL_TYPE = 10240,
    SOMITEM_PARTICLE = 16384,
    SOMITEM_ANY = 16385,
    SOMITEM_ANYATTRIBUTE = 16386,
    SOMITEM_ELEMENT = 16387,
    SOMITEM_GROUP = 16640,
    SOMITEM_ALL = 16641,
    SOMITEM_CHOICE = 16642,
    SOMITEM_SEQUENCE = 16643,
    SOMITEM_EMPTYPARTICLE = 16644,
    SOMITEM_NULL_ANY = 18433,
    SOMITEM_NULL_ANYATTRIBUTE = 18434,
    SOMITEM_NULL_ELEMENT = 18435,
  }

  const enum SXH_PROXY_SETTING {
    SXH_PROXY_SET_DEFAULT = 0,
    SXH_PROXY_SET_PRECONFIG = 0,
    SXH_PROXY_SET_DIRECT = 1,
    SXH_PROXY_SET_PROXY = 2,
  }

  const enum SXH_SERVER_CERT_OPTION {
    SXH_SERVER_CERT_IGNORE_UNKNOWN_CA = 256,
    SXH_SERVER_CERT_IGNORE_WRONG_USAGE = 512,
    SXH_SERVER_CERT_IGNORE_CERT_CN_INVALID = 4096,
    SXH_SERVER_CERT_IGNORE_CERT_DATE_INVALID = 8192,
    SXH_SERVER_CERT_IGNORE_ALL_SERVER_ERRORS = 13056,
  }

  /** Options for XHR properties */
  const enum XHR_PROPERTY {
    XHR_PROP_NO_CRED_PROMPT = 0,
    XHR_PROP_NO_AUTH = 1,
    XHR_PROP_TIMEOUT = 2,
    XHR_PROP_NO_DEFAULT_HEADERS = 3,
    XHR_PROP_REPORT_REDIRECT_STATUS = 4,
    XHR_PROP_NO_CACHE = 5,
    XHR_PROP_EXTENDED_ERROR = 6,
    XHR_PROP_QUERY_STRING_UTF8 = 7,
    XHR_PROP_IGNORE_CERT_ERRORS = 8,
    XHR_PROP_ONDATA_THRESHOLD = 9,
    XHR_PROP_SET_ENTERPRISEID = 10,
    XHR_PROP_MAX_CONNECTIONS = 11,
  }

  /** Constants that define a node's type */
  const enum DOMNodeType {
    NODE_INVALID = 0,
    NODE_ELEMENT = 1,
    NODE_ATTRIBUTE = 2,
    NODE_TEXT = 3,
    NODE_CDATA_SECTION = 4,
    NODE_ENTITY_REFERENCE = 5,
    NODE_ENTITY = 6,
    NODE_PROCESSING_INSTRUCTION = 7,
    NODE_COMMENT = 8,
    NODE_DOCUMENT = 9,
    NODE_DOCUMENT_TYPE = 10,
    NODE_DOCUMENT_FRAGMENT = 11,
    NODE_NOTATION = 12,
  }

  interface FILETIME {
    readonly dwHighDateTime: number;
    readonly dwLowDateTime: number;
  }

  /** Core DOM node interface */
  interface IXMLDOMNode {
    /** the collection of the node's attributes */
    readonly attributes: IXMLDOMNamedNodeMap<IXMLDOMAttribute>;

    /** the base name of the node (nodename with the prefix stripped off) */
    readonly baseName: string;

    /** the collection of the node's children */
    readonly childNodes: IXMLDOMNodeList;

    /** the data type of the node */
    dataType: any;

    /** pointer to the definition of the node in the DTD or schema */
    readonly definition: IXMLDOMNode_Typed;

    /** first child of the node */
    readonly firstChild: IXMLDOMNode_Typed;

    /** last child of the node */
    readonly lastChild: IXMLDOMNode_Typed;

    /** the URI for the namespace applying to the node */
    readonly namespaceURI: string;

    /** right sibling of the node */
    readonly nextSibling: IXMLDOMNode_Typed;

    /** name of the node */
    readonly nodeName: string;

    /** the node's type */
    readonly nodeType: DOMNodeType;

    /** get the strongly typed value of the node */
    nodeTypedValue: any;

    /** the type of node in string form */
    readonly nodeTypeString: string;

    /** value stored in the node */
    nodeValue: any;

    /** document that contains the node */
    readonly ownerDocument: IXMLDOMDocument;

    /** parent of the node */
    readonly parentNode: IXMLDOMNode_Typed;

    /** has sub-tree been completely parsed */
    readonly parsed: boolean;

    /** the prefix for the namespace applying to the node */
    readonly prefix: string;

    /** left sibling of the node */
    readonly previousSibling: IXMLDOMNode_Typed;

    /** indicates whether node is a default value */
    readonly specified: boolean;

    /** text content of the node and subtree */
    text: string;

    /** return the XML source for the node and each of its descendants */
    readonly xml: string;
    /** append a child node */
    appendChild<T extends IXMLDOMNode>(newChild: T): T;
    cloneNode(deep: boolean): IXMLDOMNode;
    hasChildNodes(): boolean;

    /** insert a child node */
    insertBefore<T extends IXMLDOMNode>(newChild: T, refChild: any): T;

    /** remove a child node */
    removeChild<T extends IXMLDOMNode>(childNode: T): T;

    /** replace a child node */
    replaceChild<T extends IXMLDOMNode>(newChild: IXMLDOMNode, oldChild: T): T;

    /** execute query on the subtree */
    selectNodes(queryString: string): IXMLDOMNodeList;

    /** execute query on the subtree */
    selectSingleNode(queryString: string): IXMLDOMNode_Typed;

    /** apply the stylesheet to the subtree */
    transformNode(stylesheet: IXMLDOMNode): string;

    /** apply the stylesheet to the subtree, returning the result through a document or a stream */
    transformNodeToObject(stylesheet: IXMLDOMNode, outputObject: any): void;
  }

  interface IXMLDOMDocument extends IXMLDOMNode {
    /** flag for asynchronous download */
    async: boolean;

    /** node corresponding to the DOCTYPE */
    readonly doctype: IXMLDOMDocumentType;

    /** the root of the tree */
    documentElement: IXMLDOMElement;

    /** info on this DOM implementation */
    readonly implementation: IXMLDOMImplementation;

    /** the node's type */
    readonly nodeType: DOMNodeType.NODE_DOCUMENT;

    /** register an ondataavailable event handler */
    readonly ondataavailable: any;

    /** register a readystatechange event handler */
    readonly onreadystatechange: any;

    /** register an ontransformnode event handler */
    readonly ontransformnode: any;

    /** get the last parser error */
    readonly parseError: IXMLDOMParseError;

    /** indicates whether the parser preserves whitespace */
    preserveWhiteSpace: boolean;

    /** get the state of the XML document */
    readonly readyState: number;

    /** indicates whether the parser resolves references to external DTD/Entities/Schema */
    resolveExternals: boolean;

    /** get the URL for the loaded XML document */
    readonly url: string;

    /** indicates whether the parser performs validation */
    validateOnParse: boolean;
    /** abort an asynchronous download */
    abort(): void;

    /** create an attribute node */
    createAttribute(name: string): IXMLDOMAttribute;

    /** create a CDATA section node */
    createCDATASection(data: string): IXMLDOMCDATASection;

    /** create a comment node */
    createComment(data: string): IXMLDOMComment;

    /** create a DocumentFragment node */
    createDocumentFragment(): IXMLDOMDocumentFragment;

    /** create an Element node */
    createElement(tagName: string): IXMLDOMElement;

    /** create an entity reference node */
    createEntityReference(name: string): IXMLDOMEntityReference;

    /** create a node of the specified node type and name */
    createNode(
      type: DOMNodeType.NODE_ELEMENT,
      name: string,
      namespaceURI: string
    ): IXMLDOMElement;
    createNode(
      type: DOMNodeType.NODE_ATTRIBUTE,
      name: string,
      namespaceURI: string
    ): IXMLDOMAttribute;
    createNode(
      type: DOMNodeType.NODE_TEXT,
      name: string,
      namespaceURI: string
    ): IXMLDOMText;
    createNode(
      type: DOMNodeType.NODE_CDATA_SECTION,
      name: string,
      namespaceURI: string
    ): IXMLDOMCDATASection;
    createNode(
      type: DOMNodeType.NODE_ENTITY_REFERENCE,
      name: string,
      namespaceURI: string
    ): IXMLDOMEntityReference;
    createNode(
      type: DOMNodeType.NODE_PROCESSING_INSTRUCTION,
      name: string,
      namespaceURI: string
    ): IXMLDOMProcessingInstruction;
    createNode(
      type: DOMNodeType.NODE_COMMENT,
      name: string,
      namespaceURI: string
    ): IXMLDOMComment;
    createNode(
      type: DOMNodeType.NODE_DOCUMENT_FRAGMENT,
      name: string,
      namespaceURI: string
    ): IXMLDOMDocumentFragment;

    /** create a processing instruction node */
    createProcessingInstruction(
      target: string,
      data: string
    ): IXMLDOMProcessingInstruction;

    /** create a text node */
    createTextNode(data: string): IXMLDOMText;

    /** build a list of elements by name */
    getElementsByTagName(tagName: string): IXMLDOMNodeList;

    /** load document from the specified XML source */
    load(xmlSource: any): boolean;

    /** load the document from a string */
    loadXML(bstrXML: string): boolean;

    /** retrieve node from it's ID */
    nodeFromID(idString: string): IXMLDOMNode;

    /** save the document to a specified destination */
    save(destination: any): void;
  }

  /** W3C-DOM XML Document 6.0 (Apartment) */
  interface DOMDocument60 extends IXMLDOMDocument {
    /** the data type of the node */
    dataType: string | null;

    /** A collection of all namespaces for this document */
    readonly namespaces: IXMLDOMSchemaCollection;

    /** get the state of the XML document */
    readonly readyState: number;

    /** The associated schema cache */
    schemas: any;

    /** get the value of the named property */
    getProperty(name: string): any;

    /** clone node such that clones ownerDocument is this document */
    importNode(node: IXMLDOMNode, deep: boolean): IXMLDOMNode;

    /** set the value of the named property */
    setProperty(name: string, value: any): void;

    /** perform runtime validation on the currently loaded XML document */
    validate(): IXMLDOMParseError;

    /** perform runtime validation on the currently loaded XML document node */
    validateNode(node: IXMLDOMNode): IXMLDOMParseError;
  }

  /** IMXNamespacePrefixes interface */
  interface IMXNamespacePrefixes {
    (index: number): string;
    readonly length: number;
    item(index: number): string;
  }

  /** XML Schema */
  interface ISchema {
    readonly attributeGroups: ISchemaItemCollection;
    readonly attributes: ISchemaItemCollection;
    readonly elements: ISchemaItemCollection;
    readonly id: string;
    readonly itemType: SOMITEMTYPE;
    readonly modelGroups: ISchemaItemCollection;
    readonly name: string;
    readonly namespaceURI: string;
    readonly notations: ISchemaItemCollection;
    readonly schema: ISchema;
    readonly schemaLocations: ISchemaStringCollection;
    readonly targetNamespace: string;
    readonly types: ISchemaItemCollection;
    readonly unhandledAttributes: IVBSAXAttributes;
    readonly version: string;
    writeAnnotation(annotationSink: any): boolean;
  }

  /** XML Schema Item */
  interface ISchemaItem {
    readonly id: string;
    readonly itemType: SOMITEMTYPE;
    readonly name: string;
    readonly namespaceURI: string;
    readonly schema: ISchema;
    readonly unhandledAttributes: IVBSAXAttributes;
    writeAnnotation(annotationSink: any): boolean;
  }

  /** XML Schema Item Collection */
  interface ISchemaItemCollection {
    (index: number): ISchemaItem;
    readonly length: number;
    item(index: number): ISchemaItem;
    itemByName(name: string): ISchemaItem;
    itemByQName(name: string, namespaceURI: string): ISchemaItem;
  }

  /** XML Schema String Collection */
  interface ISchemaStringCollection {
    (index: number): string;
    readonly length: number;
    item(index: number): string;
  }

  interface ISequentialStream {
    RemoteRead(pv: number, cb: number, pcbRead: number): void;
    RemoteWrite(pv: number, cb: number, pcbWritten: number): void;
  }

  /** IVBSAXAttributes interface */
  interface IVBSAXAttributes {
    /** Get the number of attributes in the list. */
    readonly length: number;
    /** Look up the index of an attribute by Namespace name. */
    getIndexFromName(strURI: string, strLocalName: string): number;

    /** Look up the index of an attribute by XML 1.0 qualified name. */
    getIndexFromQName(strQName: string): number;

    /** Look up an attribute's local name by index. */
    getLocalName(nIndex: number): string;

    /** Look up an attribute's XML 1.0 qualified name by index. */
    getQName(nIndex: number): string;

    /** Look up an attribute's type by index. */
    getType(nIndex: number): string;

    /** Look up an attribute's type by Namespace name. */
    getTypeFromName(strURI: string, strLocalName: string): string;

    /** Look up an attribute's type by XML 1.0 qualified name. */
    getTypeFromQName(strQName: string): string;

    /** Look up an attribute's Namespace URI by index. */
    getURI(nIndex: number): string;

    /** Look up an attribute's value by index. */
    getValue(nIndex: number): string;

    /** Look up an attribute's value by Namespace name. */
    getValueFromName(strURI: string, strLocalName: string): string;

    /** Look up an attribute's value by XML 1.0 qualified name. */
    getValueFromQName(strQName: string): string;
  }

  /** IVBSAXContentHandler interface */
  interface IVBSAXContentHandler {
    /** Receive an object for locating the origin of SAX document events. */
    readonly documentLocator: IVBSAXLocator;
    /** Receive notification of character data. */
    characters(strChars: string): void;

    /** Receive notification of the end of a document. */
    endDocument(): void;

    /** Receive notification of the end of an element. */
    endElement(
      strNamespaceURI: string,
      strLocalName: string,
      strQName: string
    ): void;

    /** End the scope of a prefix-URI mapping. */
    endPrefixMapping(strPrefix: string): void;

    /** Receive notification of ignorable whitespace in element content. */
    ignorableWhitespace(strChars: string): void;

    /** Receive notification of a processing instruction. */
    processingInstruction(strTarget: string, strData: string): void;

    /** Receive notification of a skipped entity. */
    skippedEntity(strName: string): void;

    /** Receive notification of the beginning of a document. */
    startDocument(): void;

    /** Receive notification of the beginning of an element. */
    startElement(
      strNamespaceURI: string,
      strLocalName: string,
      strQName: string,
      oAttributes: IVBSAXAttributes
    ): void;

    /** Begin the scope of a prefix-URI Namespace mapping. */
    startPrefixMapping(strPrefix: string, strURI: string): void;
  }

  /** IVBSAXDTDHandler interface */
  interface IVBSAXDTDHandler {
    /** Receive notification of a notation declaration event. */
    notationDecl(
      strName: string,
      strPublicId: string,
      strSystemId: string
    ): void;

    /** Receive notification of an unparsed entity declaration event. */
    unparsedEntityDecl(
      strName: string,
      strPublicId: string,
      strSystemId: string,
      strNotationName: string
    ): void;
  }

  /** IVBSAXEntityResolver interface */
  interface IVBSAXEntityResolver {
    /** Allow the application to resolve external entities. */
    resolveEntity(strPublicId: string, strSystemId: string): any;
  }

  /** IVBSAXErrorHandler interface */
  interface IVBSAXErrorHandler {
    /** Receive notification of a recoverable error. */
    error(
      oLocator: IVBSAXLocator,
      strErrorMessage: string,
      nErrorCode: number
    ): void;

    /** Receive notification of a non-recoverable error. */
    fatalError(
      oLocator: IVBSAXLocator,
      strErrorMessage: string,
      nErrorCode: number
    ): void;

    /** Receive notification of an ignorable warning. */
    ignorableWarning(
      oLocator: IVBSAXLocator,
      strErrorMessage: string,
      nErrorCode: number
    ): void;
  }

  /** IVBSAXLocator interface */
  interface IVBSAXLocator {
    /** Get the column number where the current document event ends. */
    readonly columnNumber: number;

    /** Get the line number where the current document event ends. */
    readonly lineNumber: number;

    /** Get the public identifier for the current document event. */
    readonly publicId: string;

    /** Get the system identifier for the current document event. */
    readonly systemId: string;
  }

  interface IXMLDOMAttribute extends IXMLDOMNode {
    /** get name of the attribute */
    readonly name: string;

    /** the node's type */
    readonly nodeType: DOMNodeType.NODE_ATTRIBUTE;

    /** string value of the attribute */
    value: any;
  }

  interface IXMLDOMTextDataNode extends IXMLDOMNode {
    /** value of the node */
    data: string;

    /** number of characters in value */
    readonly length: number;
    /** append string to value */
    appendData(data: string): void;

    /** delete string within the value */
    deleteData(offset: number, count: number): void;

    /** insert string into value */
    insertData(offset: number, data: string): void;

    /** replace string within the value */
    replaceData(offset: number, count: number, data: string): void;

    /** retrieve substring of value */
    substringData(offset: number, count: number): string;
  }

  interface IXMLDOMSplitableTextDataNode extends IXMLDOMTextDataNode {
    /** split the text node into two text nodes at the position specified */
    splitText(offset: number): IXMLDOMText;
  }

  interface IXMLDOMText extends IXMLDOMSplitableTextDataNode {
    /** the node's type */
    readonly nodeType: DOMNodeType.NODE_TEXT;
  }

  interface IXMLDOMCDATASection extends IXMLDOMSplitableTextDataNode {
    /** the node's type */
    readonly nodeType: DOMNodeType.NODE_CDATA_SECTION;
  }

  interface IXMLDOMComment extends IXMLDOMTextDataNode {
    /** the node's type */
    readonly nodeType: DOMNodeType.NODE_COMMENT;
  }

  interface IXMLDOMDocumentFragment extends IXMLDOMNode {
    /** the node's type */
    readonly nodeType: DOMNodeType.NODE_DOCUMENT_FRAGMENT;
  }

  interface IXMLDOMDocumentType extends IXMLDOMNode {
    /** a list of entities in the document */
    readonly entities: IXMLDOMNamedNodeMap;

    /** name of the document type (root of the tree) */
    readonly name: string;

    /** the node's type */
    readonly nodeType: DOMNodeType.NODE_DOCUMENT_TYPE;

    /** a list of notations in the document */
    readonly notations: IXMLDOMNamedNodeMap;
  }

  interface IXMLDOMElement extends IXMLDOMNode {
    /** the node's type */
    readonly nodeType: DOMNodeType.NODE_ELEMENT;

    /** get the tagName of the element */
    readonly tagName: string;
    /** look up the string value of an attribute by name */
    getAttribute(name: string): any;

    /** look up the attribute node by name */
    getAttributeNode(name: string): IXMLDOMAttribute;

    /** collapse all adjacent text nodes in sub-tree */
    normalize(): void;

    /** remove an attribute by name */
    removeAttribute(name: string): void;

    /** remove the specified attribute */
    removeAttributeNode(DOMAttribute: IXMLDOMAttribute): IXMLDOMAttribute;

    /** set the string value of an attribute by name */
    setAttribute(name: string, value: any): void;

    /** set the specified attribute on the element */
    setAttributeNode(DOMAttribute: IXMLDOMAttribute): IXMLDOMAttribute;
  }

  interface IXMLDOMEntityReference extends IXMLDOMNode {
    /** the node's type */
    readonly nodeType: DOMNodeType.NODE_ENTITY_REFERENCE;
  }

  interface IXMLDOMImplementation {
    hasFeature(feature: string, version: string): boolean;
  }

  interface IXMLDOMNamedNodeMap<T extends IXMLDOMNode = IXMLDOMNode_Typed> {
    /** collection of nodes */
    (index: number): T;

    /** number of nodes in the collection */
    readonly length: number;
    /** lookup item by name */
    getNamedItem(name: string): T;

    /** lookup the item by name and namespace */
    getQualifiedItem(baseName: string, namespaceURI: string): T;

    /** collection of nodes */
    item(index: number): T;

    /** get next node from iterator */
    nextNode(): T;

    /** remove item by name */
    removeNamedItem(name: string): T;

    /** remove the item by name and namespace */
    removeQualifiedItem(baseName: string, namespaceURI: string): T;

    /** reset the position of iterator */
    reset(): void;

    /** set item by name */
    setNamedItem(newItem: T): T;
  }

  interface IXMLDOMNodeList<T extends IXMLDOMNode = IXMLDOMNode_Typed> {
    /** collection of nodes */
    (index: number): T;

    /** number of nodes in the collection */
    readonly length: number;
    /** collection of nodes */
    item(index: number): T;

    /** get next node from iterator */
    nextNode(): T;

    /** reset the position of iterator */
    reset(): void;
  }

  /** structure for reporting parser errors */
  interface IXMLDOMParseError {
    /** the error code */
    readonly errorCode: number;

    /** the absolute file position in the XML document containing the error */
    readonly filepos: number;

    /** the line number in the XML document where the error occurred */
    readonly line: number;

    /** the character position in the line containing the error */
    readonly linepos: number;

    /** the cause of the error */
    readonly reason: string;

    /** the data where the error occurred */
    readonly srcText: string;

    /** the URL of the XML document containing the error */
    readonly url: string;
  }

  interface IXMLDOMProcessingInstruction extends IXMLDOMNode {
    /** the data */
    data: string;

    /** the node's type */
    readonly nodeType: DOMNodeType.NODE_PROCESSING_INSTRUCTION;

    /** the target */
    readonly target: string;
  }

  /** XML Schemas Collection */
  interface IXMLDOMSchemaCollection {
    /** Get namespaceURI for schema by index */
    (index: number): string;

    /** number of schemas in collection */
    readonly length: number;
    /** add a new schema */
    add(namespaceURI: string, v: any): void;

    /** copy & merge other collection into this one */
    addCollection(otherCollection: IXMLDOMSchemaCollection): void;

    /** lookup schema by namespaceURI */
    get(namespaceURI: string): IXMLDOMNode;

    /** Get namespaceURI for schema by index */
    namespaceURI(index: number): string;

    /** remove schema by namespaceURI */
    remove(namespaceURI: string): void;
  }

  /** IXSLProcessor Interface */
  interface IXSLProcessor {
    /** XML input tree to transform */
    input: any;

    /** custom stream object for transform output */
    output: any;

    /** template object used to create this processor object */
    readonly ownerTemplate: XSLTemplate60;

    /** current state of the processor */
    readonly readyState: number;

    /** starting XSL mode */
    readonly startMode: string;

    /** namespace of starting XSL mode */
    readonly startModeURI: string;

    /** current stylesheet being used */
    readonly stylesheet: IXMLDOMNode;
    /** pass object to stylesheet */
    addObject(obj: any, namespaceURI: string): void;

    /**
     * set <xsl:param> values
     * @param namespaceURI [namespaceURI='0']
     */
    addParameter(baseName: string, parameter: any, namespaceURI?: string): void;

    /** reset state of processor and abort current transform */
    reset(): void;

    /**
     * set XSL mode and it's namespace
     * @param namespaceURI [namespaceURI='0']
     */
    setStartMode(mode: string, namespaceURI?: string): void;

    /** start/resume the XSL transformation process */
    transform(): boolean;
  }

  /** Microsoft HTML Writer 6.0 */
  interface MXHTMLWriter60 {
    /** Determine whether or not to write the byte order mark */
    byteOrderMark: boolean;

    /** When enabled, the writer no longer escapes out its input when writing it out. */
    disableOutputEscaping: boolean;

    /** Set or get the output encoding. */
    encoding: string;

    /** Enable or disable auto indent mode. */
    indent: boolean;

    /** Determine whether or not to omit the XML declaration. */
    omitXMLDeclaration: boolean;

    /** Set or get the output. */
    output: any;

    /** Set or get the standalone document declaration. */
    standalone: boolean;

    /** Set or get the xml version info. */
    version: string;

    /** Flushes all writer buffers forcing the writer to write to the underlying output object */
    flush(): void;
  }

  /** MX Namespace Manager 6.0 */
  interface MXNamespaceManager60 {
    allowOverride: boolean;
    declarePrefix(prefix: string, namespaceURI: string): void;
    getDeclaredPrefixes(): IMXNamespacePrefixes;
    getPrefixes(namespaceURI: string): IMXNamespacePrefixes;
    getURI(prefix: string): any;
    getURIFromNode(strPrefix: string, contextNode: IXMLDOMNode): any;
    popContext(): void;
    pushContext(): void;

    /** @param fDeep [fDeep=true] */
    pushNodeContext(contextNode: IXMLDOMNode, fDeep?: boolean): void;
    reset(): void;
  }

  /** Microsoft XML Writer 6.0 */
  interface MXXMLWriter60 {
    /** Determine whether or not to write the byte order mark */
    byteOrderMark: boolean;

    /** When enabled, the writer no longer escapes out its input when writing it out. */
    disableOutputEscaping: boolean;

    /** Set or get the output encoding. */
    encoding: string;

    /** Enable or disable auto indent mode. */
    indent: boolean;

    /** Determine whether or not to omit the XML declaration. */
    omitXMLDeclaration: boolean;

    /** Set or get the output. */
    output: any;

    /** Set or get the standalone document declaration. */
    standalone: boolean;

    /** Set or get the xml version info. */
    version: string;

    /** Flushes all writer buffers forcing the writer to write to the underlying output object */
    flush(): void;
  }

  /** SAX Attributes 6.0 */
  interface SAXAttributes60 {
    /** Add an attribute to the end of the list. */
    addAttribute(
      strURI: string,
      strLocalName: string,
      strQName: string,
      strType: string,
      strValue: string
    ): void;

    /** Add an attribute, whose value is equal to the indexed attribute in the input attributes object, to the end of the list. */
    addAttributeFromIndex(varAtts: any, nIndex: number): void;

    /** Clear the attribute list for reuse. */
    clear(): void;

    /** Remove an attribute from the list. */
    removeAttribute(nIndex: number): void;

    /** Set an attribute in the list. */
    setAttribute(
      nIndex: number,
      strURI: string,
      strLocalName: string,
      strQName: string,
      strType: string,
      strValue: string
    ): void;

    /** Copy an entire Attributes object. */
    setAttributes(varAtts: any): void;

    /** Set the local name of a specific attribute. */
    setLocalName(nIndex: number, strLocalName: string): void;

    /** Set the qualified name of a specific attribute. */
    setQName(nIndex: number, strQName: string): void;

    /** Set the type of a specific attribute. */
    setType(nIndex: number, strType: string): void;

    /** Set the Namespace URI of a specific attribute. */
    setURI(nIndex: number, strURI: string): void;

    /** Set the value of a specific attribute. */
    setValue(nIndex: number, strValue: string): void;
  }

  /** SAX XML Reader 6.0 */
  interface SAXXMLReader60 {
    /** Set or get the base URL for the document. */
    baseURL: string;

    /** Allow an application to register a content event handler or look up the current content event handler. */
    contentHandler: IVBSAXContentHandler;

    /** Allow an application to register a DTD event handler or look up the current DTD event handler. */
    dtdHandler: IVBSAXDTDHandler;

    /** Allow an application to register an entity resolver or look up the current entity resolver. */
    entityResolver: IVBSAXEntityResolver;

    /** Allow an application to register an error event handler or look up the current error event handler. */
    errorHandler: IVBSAXErrorHandler;

    /** Set or get the secure base URL for the document. */
    secureBaseURL: string;

    /** Look up the value of a feature. */
    getFeature(strName: string): boolean;

    /** Look up the value of a property. */
    getProperty(strName: string): any;

    /** Parse an XML document. */
    parse(varInput?: any): void;

    /** Parse an XML document from a system identifier (URI). */
    parseURL(strURL: string): void;

    /** Set the state of a feature. */
    putFeature(strName: string, fValue: boolean): void;

    /** Set the value of a property. */
    putProperty(strName: string, varValue: any): void;
  }

  /** Server XML HTTP Request 6.0  */
  interface ServerXMLHTTP60 {
    /** Register a complete event handler */
    readonly onreadystatechange: any;

    /** Get ready state */
    readonly readyState: number;

    /** Get response body */
    readonly responseBody: any;

    /** Get response body */
    readonly responseStream: any;

    /** Get response body */
    readonly responseText: string;

    /** Get response body */
    readonly responseXML: any;

    /** Get HTTP status code */
    readonly status: number;

    /** Get HTTP status text */
    readonly statusText: string;
    /** Abort HTTP request */
    abort(): void;

    /** Get all HTTP response headers */
    getAllResponseHeaders(): string;

    /** Get an option value */
    getOption(option: SERVERXMLHTTP_OPTION): any;

    /** Get HTTP response header */
    getResponseHeader(bstrHeader: string): string;

    /** Open HTTP connection */
    open(
      bstrMethod: string,
      bstrUrl: string,
      varAsync?: any,
      bstrUser?: any,
      bstrPassword?: any
    ): void;

    /** Send HTTP request */
    send(varBody?: any): void;

    /** Set an option value */
    setOption(option: SERVERXMLHTTP_OPTION, value: any): void;

    /** Specify proxy configuration */
    setProxy(
      proxySetting: SXH_PROXY_SETTING,
      varProxyServer?: any,
      varBypassList?: any
    ): void;

    /** Specify proxy authentication credentials */
    setProxyCredentials(bstrUserName: string, bstrPassword: string): void;

    /** Add HTTP request header */
    setRequestHeader(bstrHeader: string, bstrValue: string): void;

    /** Specify timeout settings (in milliseconds) */
    setTimeouts(
      resolveTimeout: number,
      connectTimeout: number,
      sendTimeout: number,
      receiveTimeout: number
    ): void;

    /** Wait for asynchronous send to complete, with optional timeout (in seconds) */
    waitForResponse(timeoutInSeconds?: any): boolean;
  }

  interface tagXHR_COOKIE {
    readonly dwFlags: number;
    readonly ftExpires: FILETIME;
    readonly pwszName: string;
    readonly pwszP3PPolicy: string;
    readonly pwszUrl: string;
    readonly pwszValue: string;
  }

  /** XML HTTP Request class 6.0 */
  interface XMLHTTP60 {
    /** Register a complete event handler */
    readonly onreadystatechange: any;

    /** Get ready state */
    readonly readyState: number;

    /** Get response body */
    readonly responseBody: any;

    /** Get response body */
    readonly responseStream: any;

    /** Get response body */
    readonly responseText: string;

    /** Get response body */
    readonly responseXML: any;

    /** Get HTTP status code */
    readonly status: number;

    /** Get HTTP status text */
    readonly statusText: string;
    /** Abort HTTP request */
    abort(): void;

    /** Get all HTTP response headers */
    getAllResponseHeaders(): string;

    /** Get HTTP response header */
    getResponseHeader(bstrHeader: string): string;

    /** Open HTTP connection */
    open(
      bstrMethod: string,
      bstrUrl: string,
      varAsync?: any,
      bstrUser?: any,
      bstrPassword?: any
    ): void;

    /** Send HTTP request */
    send(varBody?: any): void;

    /** Add HTTP request header */
    setRequestHeader(bstrHeader: string, bstrValue: string): void;
  }

  /** XML Schema Cache 6.0 */
  interface XMLSchemaCache60 {
    /** Get namespaceURI for schema by index */
    (index: number): string;

    /** number of schemas in collection */
    readonly length: number;
    validateOnLoad: boolean;
    /** add a new schema */
    add(namespaceURI: string, v: any): void;

    /** copy & merge other collection into this one */
    addCollection(otherCollection: IXMLDOMSchemaCollection): void;

    /** lookup schema by namespaceURI */
    get(namespaceURI: string): IXMLDOMNode;
    getDeclaration(node: IXMLDOMNode): ISchemaItem;
    getSchema(namespaceURI: string): ISchema;

    /** Get namespaceURI for schema by index */
    namespaceURI(index: number): string;

    /** remove schema by namespaceURI */
    remove(namespaceURI: string): void;
    validate(): void;
  }

  /** XSL Stylesheet Cache 6.0 */
  interface XSLTemplate60 {
    /** stylesheet to use with processors */
    stylesheet: IXMLDOMNode;
    /** create a new processor object */
    createProcessor(): IXSLProcessor;
  }

  interface IXMLDOMNotation extends IXMLDOMNode {
    nodeType: DOMNodeType.NODE_NOTATION;
    publicID: string;
    systemID: string;
  }

  type IXMLDOMNode_Typed =
    | IXMLDOMElement
    | IXMLDOMAttribute
    | IXMLDOMText
    | IXMLDOMCDATASection
    | IXMLDOMEntityReference
    | IXMLDOMProcessingInstruction
    | IXMLDOMComment
    | IXMLDOMDocument
    | IXMLDOMDocumentType
    | IXMLDOMDocumentFragment
    | IXMLDOMNotation;
}

interface ActiveXObject {
  on(
    obj: MSXML2.DOMDocument60,
    event: 'ondataavailable' | 'onreadystatechange',
    handler: (this: MSXML2.DOMDocument60, parameter: {}) => void
  ): void;
}

interface ActiveXObjectNameMap {
  'Msxml2.DOMDocument': MSXML2.DOMDocument60;
  'Msxml2.DOMDocument.6.0': MSXML2.DOMDocument60;
  'Msxml2.FreeThreadedDOMDocument': MSXML2.DOMDocument60;
  'Msxml2.MXHTMLWriter': MSXML2.MXHTMLWriter60;
  'Msxml2.MXNamespaceManager': MSXML2.MXNamespaceManager60;
  'Msxml2.MXXMLWriter': MSXML2.MXXMLWriter60;
  'Msxml2.SAXAttributes': MSXML2.SAXAttributes60;
  'Msxml2.SAXXMLReader': MSXML2.SAXXMLReader60;
  'Msxml2.ServerXMLHTTP': MSXML2.ServerXMLHTTP60;
  'Msxml2.XMLHTTP': MSXML2.XMLHTTP60;
  'Msxml2.XMLSchemaCache': MSXML2.XMLSchemaCache60;
  'Msxml2.XSLTemplate': MSXML2.XSLTemplate60;
}

interface EnumeratorConstructor {
  new <T extends MSXML2.IXMLDOMNode = MSXML2.IXMLDOMNode_Typed>(
    collection: MSXML2.IXMLDOMNodeList<T>
  ): Enumerator<T>;
}

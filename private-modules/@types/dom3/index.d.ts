declare namespace DOM3 {
  export const enum NodeType {
    ELEMENT_NODE = 1,
    ATTRIBUTE_NODE = 2,
    TEXT_NODE = 3,
    CDATA_SECTION_NODE = 4,
    ENTITY_REFERENCE_NODE = 5,
    ENTITY_NODE = 6,
    PROCESSING_INSTRUCTION_NODE = 7,
    COMMENT_NODE = 8,
    DOCUMENT_NODE = 9,
    DOCUMENT_TYPE_NODE = 10,
    DOCUMENT_FRAGMENT_NODE = 11,
    NOTATION_NODE = 12,
  }
  /** &lt;element/> */
  export const ELEMENT_NODE = NodeType.ELEMENT_NODE;
  /** attribute="" */
  export const ATTRIBUTE_NODE = NodeType.ATTRIBUTE_NODE;
  /** text */
  export const TEXT_NODE = NodeType.TEXT_NODE;
  /** &lt;![CDATA[ CData Section ]]&gt; */
  export const CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE;
  /** &entity-reference; */
  export const ENTITY_REFERENCE_NODE = NodeType.ENTITY_REFERENCE_NODE;
  /** entity */
  export const ENTITY_NODE = NodeType.ENTITY_NODE;
  /** &lt;?processing-instruction?> */
  export const PROCESSING_INSTRUCTION_NODE =
    NodeType.PROCESSING_INSTRUCTION_NODE;
  /** &lt;!-- comment --> */
  export const COMMENT_NODE = NodeType.COMMENT_NODE;
  /** document */
  export const DOCUMENT_NODE = NodeType.DOCUMENT_NODE;
  /** doctype */
  export const DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE;
  /** fragment */
  export const DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE;
  /** notation */
  export const NOTATION_NODE = NodeType.NOTATION_NODE;

  export const enum READYSTATE {
    LOADING = 1,
    LOADED = 2,
    INTERACTIVE = 3,
    COMPLETED = 4,
  }
  /**
   * ロード中です。永続的なプロパティを読み込んでいますが、データはまだ解析していません。
   */
  export const LOADING = READYSTATE.LOADING;
  /**
   * 永続プロパティの読み込みが完了しました。データの読み込みと解析は完了していが、オブジェクトモデルはまだ利用できていません。
   */
  export const LOADED = READYSTATE.LOADED;
  /**
   * 一部のデータの読み込みと解析が完了し、部分的に取得したデータセットでオブジェクトモデルが利用可能になりました。この状態の間、オブジェクトモデルは利用可能ですが、読み取り専用です。
   */
  export const INTERACTIVE = READYSTATE.INTERACTIVE;
  /**
   * ドキュメントが完全に読み込まれたか、成功したか、失敗したかのどちらかです。
   */
  export const COMPLETED = READYSTATE.COMPLETED;
  type Node =
    | Element
    | Attr
    | Text
    | CDATASection
    | EntityReference
    | Entity
    | ProcessingInstruction
    | Comment
    | Document
    | DocumentType
    | DocumentFragment
    | Notation;
  interface NodeBase {
    readonly nodeName: string;
    readonly nodeValue: string;
    readonly nodeType: NodeType;
    readonly parentNode: Node;
    readonly childNodes: NodeList;
    readonly firstChild: Node;
    readonly lastChild: Node;
    readonly previousSibling: Node;
    readonly nextSibling: Node;
    readonly attributes: NamedNodeMap<Attr>;
    readonly ownerDocument: Document;
    insertBefore(newChild: Node, refChild: Node): Node;
    replaceChild(newChild: Node, oldChild: Node): Node;
    removeChild(oldChild: Node): Node;
    appendChild(newChild: Node): Node;
    hasChildNodes(): boolean;
    cloneNode(deep: boolean): Node;
    selectNodes(query: string): NodeList;
    selectSingleNode(query: string): Node;
    readonly baseName: string;
    readonly namespaceURI: string;
    readonly prefix: string;
    nodeTypedValue: any;
    readonly nodeTypeString: string;
    readonly definition: Node;
    transformNode(stylesheet: Node): string;
    transformNodeToObject(stylesheet: Node, outputObject: any): void;
    readonly specified: boolean;
    readonly parsed: boolean;
    text: string;
    readonly xml: string;
  }
  export interface NodeList<T = Node> {
    readonly length: number;
    item(index: number): T;
    [index: number]: T;
  }
  export interface NamedNodeMap<T = Node> {
    readonly length: number;
    getNamedItem(name: String): T;
    setNamedItem(arg: Node): T;
    removeNamedItem(name: String): T;
    item(index: Number): T;
    [index: number]: T;
    getQualifiedItem(name: string, namespaceURI: string): T;
    nextNode(): T;
    removeQualifiedItem(name: string, namespaceURI: string): T;
  }
  export interface DOMImplementation {
    hasFeature(feature: string, version: string): boolean;
  }
  export interface Element extends NodeBase {
    readonly nodeType: NodeType.ELEMENT_NODE;
    readonly tagName: string;
    getAttribute(name: string): string;
    setAttribute(name: string, value: string): void;
    removeAttribute(name: string): void;
    getAttributeNode(name: string): Attr;
    setAttributeNode(newAttr: Attr): Attr;
    removeAttributeNode(oldAttr: Attr): Attr;
    getElementsByTagName(name: string): NodeList;
    normalize(): void;
  }
  export interface Attr extends NodeBase {
    readonly nodeType: NodeType.ATTRIBUTE_NODE;
    readonly name: string;
    readonly specified: boolean;
    value: string;
  }
  export interface CharacterData extends NodeBase {
    readonly data: string;
    readonly length: number;
    substringData(offset: Number, count: Number): String;
    appendData(arg: String): void;
    insertData(offset: Number, arg: String): void;
    deleteData(offset: Number, count: Number): void;
    replaceData(offset: Number, count: Number, arg: String): void;
  }
  export interface SplitableCharacterData extends CharacterData {
    splitText(offset: number): Text;
  }
  export interface Text extends SplitableCharacterData {
    readonly nodeType: NodeType.TEXT_NODE;
  }
  export interface CDATASection extends SplitableCharacterData {
    readonly nodeType: NodeType.CDATA_SECTION_NODE;
  }
  export interface EntityReference extends NodeBase {
    readonly nodeType: NodeType.ENTITY_REFERENCE_NODE;
  }
  export interface Entity extends NodeBase {
    readonly nodeType: NodeType.ENTITY_NODE;
    readonly publicId: string;
    readonly systemId: string;
    readonly notationName: string;
  }
  export interface ProcessingInstruction extends NodeBase {
    readonly nodeType: NodeType.PROCESSING_INSTRUCTION_NODE;
    readonly target: string;
    data: string;
  }
  export interface Comment extends CharacterData {
    readonly nodeType: NodeType.COMMENT_NODE;
  }
  export interface Document extends NodeBase {
    readonly nodeType: NodeType.DOCUMENT_NODE;
    readonly doctype: DocumentType;
    readonly implementation: DOMImplementation;
    readonly documentElement: Element;
    createElement(tagName: string): Element;
    createDocumentFragment(): DocumentFragment;
    createTextNode(data: string): Text;
    createComment(data: string): Comment;
    createCDATASection(data: string): CDATASection;
    createProcessingInstruction(
      target: string,
      data: string
    ): ProcessingInstruction;
    createAttribute(name: string): Attr;
    createEntityReference(name: string): EntityReference;
    getElementsByTagName(tagname: string): NodeList;
    createNode(
      type: NodeType.ELEMENT_NODE,
      name: string,
      namespaceURI: string
    ): Element;
    createNode(
      type: NodeType.ATTRIBUTE_NODE,
      name: string,
      namespaceURI: string
    ): Attr;
    createNode(
      type: NodeType.DOCUMENT_FRAGMENT_NODE,
      _: '',
      _2: ''
    ): DocumentFragment;
    createNode(type: NodeType.TEXT_NODE, _: '', _2: ''): Text;
    createNode(type: NodeType.CDATA_SECTION_NODE, _: '', _2: ''): CDATASection;
    createNode(type: NodeType.COMMENT_NODE, _: '', _2: ''): Comment;
    createNode(
      type: NodeType.PROCESSING_INSTRUCTION_NODE,
      target: string,
      _: ''
    ): ProcessingInstruction;
    createNode(
      type: NodeType.ENTITY_REFERENCE_NODE,
      name: string,
      _: ''
    ): EntityReference;
    abort(): void;
    load(xmlSource: any): boolean;
    loadXML(xml: string): boolean;
    nodeFromID(id: string): Node;
    save(destination: any): void;
    readonly parseError: {
      readonly errorCode: number;
      readonly filepos: number;
      readonly line: number;
      readonly linepos: number;
      readonly reason: string;
      readonly srcText: string;
      readonly url: string;
    };
    async: boolean;
    readonly readyState: READYSTATE;
    readonly url: string;
    preserveWhiteSpace: boolean;
    resolveExternals: boolean;
    validateOnParse: boolean;
    readonly ondataavailable: any;
    readonly onreadystatechange: any;
    readonly ontransformnode: any;
  }
  export interface DocumentType extends NodeBase {
    readonly nodeType: NodeType.DOCUMENT_TYPE_NODE;
    readonly name: string;
    readonly entities: NamedNodeMap;
    readonly notations: NamedNodeMap;
  }
  export interface DocumentFragment extends NodeBase {
    readonly nodeType: NodeType.DOCUMENT_FRAGMENT_NODE;
  }
  export interface Notation extends NodeBase {
    readonly nodeType: NodeType.NOTATION_NODE;
    readonly publicId: string;
    readonly systemId: string;
  }
  export interface FreeThreadedDocument extends Document {
    'Msxml2.FreeThreadedDOMDocument': never;
  }
}

interface ActiveXObjectNameMap {
  'MSXML2.DOMDocument.6.0': DOM3.Document;
  'Msxml2.FreeThreadedDOMDocument': DOM3.FreeThreadedDocument;
}

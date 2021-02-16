/// <reference types="dom3" />
/// <reference types="iterables" />

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

namespace XmlWriter {
  function neverNode(node: never): never {
    throw new Error(`Unknown node type: ${(node as any).nodeType}`);
  }
  const nodeTypeString: {[type in DOM3.NodeType]: string} = {
    [DOM3.NodeType.ATTRIBUTE_NODE]: 'ATTRIBUTE',
    [DOM3.NodeType.CDATA_SECTION_NODE]: 'CDATA SECTION',
    [DOM3.NodeType.COMMENT_NODE]: 'COMMENT',
    [DOM3.NodeType.DOCUMENT_NODE]: 'DOCUMENT',
    [DOM3.NodeType.DOCUMENT_FRAGMENT_NODE]: 'DOCUMENT FRAGMENT',
    [DOM3.NodeType.DOCUMENT_TYPE_NODE]: 'DOCTYPE',
    [DOM3.NodeType.ELEMENT_NODE]: 'ELEMENT',
    [DOM3.NodeType.ENTITY_NODE]: 'ENTITY',
    [DOM3.NodeType.ENTITY_REFERENCE_NODE]: 'ENTITY REFERENCE',
    [DOM3.NodeType.NOTATION_NODE]: 'NOTATION',
    [DOM3.NodeType.PROCESSING_INSTRUCTION_NODE]: 'PI',
    [DOM3.NodeType.TEXT_NODE]: 'TEXT',
  };
  declare const stream: ADODB.Stream;
  export function writeToFileByUtf8N(content: string, filepath: string): void {
    if (stream.State !== ADODB.ObjectStateEnum.adStateClosed) {
      throw new Error(`streamが閉じられていません。`);
    }
    stream.Type = ADODB.StreamTypeEnum.adTypeText;
    stream.Charset = 'UTF-8';
    stream.Open();
    try {
      stream.WriteText(content);
      stream.Position = 0;
      stream.Type = ADODB.StreamTypeEnum.adTypeBinary;
      stream.Position = 3;
      const binary = stream.Read();
      stream.Position = 0;
      stream.Write(binary);
      stream.SetEOS();
      stream.SaveToFile(filepath);
    } finally {
      stream.Close();
    }
  }
  interface INamespace {
    prefix: string;
    namespaceURI: string;
  }
  function ensurePrifix(
    {prefix, namespaceURI, nodeType}: DOM3.Node,
    map: INamespace[],
    appendix: INamespace[]
  ): INamespace[] {
    if (prefix && !namespaceURI) {
      throw new Error(`宣言されてない名前空間の接頭語への参照です: ${prefix}`);
    }
    if (nodeType === DOM3.NodeType.ATTRIBUTE_NODE && !prefix) {
      return map;
    }
    prefix = prefix || '';
    namespaceURI = namespaceURI || '';
    if (
      (map.find(({prefix: p}) => prefix === p)?.namespaceURI ?? '') ===
      namespaceURI
    ) {
      return map;
    }
    appendix.push({prefix, namespaceURI});
    return [{prefix, namespaceURI}, ...map];
  }
  function insertIndent(
    node: DOM3.Node,
    indent: string,
    depth: number
  ): string {
    if (depth < 0) {
      return '';
    }
    if (depth === 0) {
      return '\n';
    }
    switch (node.nodeType) {
      case DOM3.NodeType.TEXT_NODE:
      case DOM3.NodeType.ENTITY_REFERENCE_NODE:
        switch (node.previousSibling?.nodeType) {
          case DOM3.NodeType.TEXT_NODE:
          case DOM3.NodeType.ENTITY_REFERENCE_NODE:
            return '';
        }
        if (
          node.nodeType === DOM3.NodeType.TEXT_NODE &&
          !/^\S(?:[\s\S]*\S)?$/.test(node.data)
        ) {
          return '';
        }
    }
    if (
      node.previousSibling?.nodeType == DOM3.NodeType.TEXT_NODE &&
      !/\S/.test(node.previousSibling.data)
    ) {
      return '';
    }
    return '\n' + indent.repeat(depth);
  }
  export function toXml(
    doc: DOM3.Document,
    options?: {
      indent?: number | boolean | {hardTab?: boolean; count?: number};
      xmldecl?: boolean;
      encoding?: string;
      standalone?: boolean;
    }
  ): string {
    const indent = (() => {
      const indent = options?.indent ?? {hardTab: false, count: 2};
      if (typeof indent === 'boolean') return indent ? '  ' : '';
      if (typeof indent === 'number') return ' '.repeat(indent);
      return indent.hardTab
        ? '\t'.repeat(indent.count ?? 1)
        : ' '.repeat(indent.count ?? 2);
    })();
    const xmldecl: {
      version: '1.0';
      encoding?: string;
      standalone?: 'yes' | 'no';
    } = {
      version: '1.0',
      encoding: options?.encoding,
    };
    const {encoding, standalone} =
      doc.firstChild?.nodeType === DOM3.NodeType.PROCESSING_INSTRUCTION_NODE &&
      doc.firstChild.nodeName === 'xml' &&
      /^version="1.0"( encoding="([^\"]*)")?( standalone="(yes|no)")?$/.test(
        doc.firstChild.data
      )
        ? {
            encoding: RegExp.$1 ? RegExp.$2 : undefined,
            standalone: RegExp.$3 ? RegExp.$4 : undefined,
          }
        : {
            encoding: options?.encoding,
            standalone:
              options?.standalone !== undefined
                ? options?.standalone
                  ? 'yes'
                  : 'no'
                : undefined,
          };
    return (
      ((options?.xmldecl ?? true) &&
        `<?xml version="1.0"${encoding ? ' encoding="' + encoding + '"' : ''}${
          standalone ? ' standalone="' + standalone + '"' : ''
        }?>\n`) +
      (function _toXml(self: DOM3.Node, depth: number, map: INamespace[]) {
        let xml = '';
        for (const node of Iterables.from(self.childNodes)) {
          switch (node.nodeType) {
            case DOM3.NodeType.CDATA_SECTION_NODE:
              xml += insertIndent(node, indent, depth);
              xml += '<![CDATA[' + node.data + ']' + ']>';
              break;
            case DOM3.NodeType.TEXT_NODE:
              switch (node.previousSibling?.nodeType) {
                case DOM3.NodeType.TEXT_NODE:
                case DOM3.NodeType.ENTITY_REFERENCE_NODE:
                  break;
                default:
                  if (/^\S(?:[\s\S]*\S)?$/.test(node.data)) {
                    xml += insertIndent(node, indent, depth);
                  }
                  break;
              }
              xml += escapeXml(node.data);
              break;
            case DOM3.NodeType.ENTITY_REFERENCE_NODE:
              switch (node.previousSibling?.nodeType) {
                case DOM3.NodeType.TEXT_NODE:
                case DOM3.NodeType.ENTITY_REFERENCE_NODE:
                  break;
                default:
                  xml += insertIndent(node, indent, depth);
                  break;
              }
              xml += `&${node.nodeName};`;
              break;
            case DOM3.NodeType.COMMENT_NODE:
              xml += insertIndent(node, indent, depth);
              xml += node.data ? '<!--' + node.data + '-->' : '<!-->';
              break;
            case DOM3.NodeType.PROCESSING_INSTRUCTION_NODE:
              if (
                depth === 0 &&
                node.nodeName === 'xml' &&
                (options?.xmldecl ?? true)
              ) {
                break;
              }
              xml += insertIndent(node, indent, depth);
              xml += `<?${node.nodeName} ${node.nodeValue}?>`;
              break;
            case DOM3.NodeType.ELEMENT_NODE:
              {
                const currentIndent = insertIndent(node, indent, depth);
                xml += currentIndent;
                xml += `<${node.nodeName}`;
                const appendix: INamespace[] = [];
                let currentMap = ensurePrifix(node, map, appendix);
                for (const attr of Iterables.from(node.attributes)) {
                  xml += ` ${attr.nodeName}="${escapeXml(attr.value)}"`;
                  if (attr.prefix) {
                    currentMap = ensurePrifix(attr, currentMap, appendix);
                  }
                }
                for (const {prefix, namespaceURI} of appendix) {
                  xml += ` xmlns${prefix ? ':' + prefix : ''}="${escapeXml(
                    namespaceURI
                  )}"`;
                }
                if (!node.firstChild) {
                  xml += '/>';
                } else if (
                  Iterables.from(node.childNodes).every(
                    child =>
                      [DOM3.NodeType.TEXT_NODE, DOM3.NodeType.ENTITY_REFERENCE_NODE].indexOf(
                        child.nodeType
                      ) >= 0
                  )
                ) {
                  xml += '>';
                  xml += _toXml(node, -1, currentMap);
                  xml += `</${node.nodeName}>`;
                } else {
                  xml += '>';
                  xml += _toXml(node, depth + 1, currentMap);
                  xml += `${currentIndent}</${node.nodeName}>`;
                }
              }
              break;
            default:
              neverNode(node);
            case DOM3.NodeType.ATTRIBUTE_NODE:
            case DOM3.NodeType.DOCUMENT_NODE:
            case DOM3.NodeType.DOCUMENT_FRAGMENT_NODE:
            case DOM3.NodeType.DOCUMENT_TYPE_NODE:
            case DOM3.NodeType.NOTATION_NODE:
            case DOM3.NodeType.ENTITY_NODE:
              throw new Error(
                `サポート対象外の種類のノードです。: ${
                  nodeTypeString[node.nodeType] || 'UNKNOWN:' + node.nodeType
                }`
              );
          }
        }
        return xml;
      })(doc, 0, [])
    );
  }
  const escapeXml_table = {
    '"': '&quot;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  } as const;
  function escapeXml(s: string): string {
    return s.replace(
      /["&<>]/g,
      ch => escapeXml_table[ch as keyof typeof escapeXml_table]
    );
  }
}

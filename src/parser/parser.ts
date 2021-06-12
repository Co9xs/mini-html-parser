import { Attribute, Token, TokenTypes } from "../token/token"

type NodeType = 'document' | 'element' | 'text'

interface Node {
  type: NodeType
}

interface ElementNode extends Node {
  type: 'document' | 'element'
  tagName: string
  children?: (ElementNode | TextNode)[]
  attributes?: Attribute[]
}

interface TextNode extends Node {
  type: 'text'
  content: string
}

export class Parser {
  tokenStack: Token[]
  nodeStack: (ElementNode | TextNode)[]
  ast: any

  constructor(tokens: Token[]) {
    this.tokenStack = [...tokens]
    this.nodeStack = []
    this.ast = null
  }

  emit(): void {
    const curToken = this.tokenStack.pop()
    const lastNode = this.nodeStack[this.nodeStack.length - 1]
    switch(curToken.Type) {
      case TokenTypes.DOCTYPE:
        const rootNode = this.createNode(curToken);
        this.nodeStack.push(rootNode)
        break;
      case TokenTypes.Start:
        const startNode = this.createNode(curToken);
        (lastNode as ElementNode).children.push(startNode);
        this.nodeStack.push(startNode)
        break;
      case TokenTypes.Text:
        const textNode = this.createNode(curToken);
        (lastNode as ElementNode).children.push(textNode)
        break;
      case TokenTypes.SelfClosing:
        const selfClosingNode = this.createNode(curToken);
        (lastNode as ElementNode).children.push(selfClosingNode)
        break;
      case TokenTypes.End:
        // 現在のtokenとnodeStackの先頭要素を比較して対応していれば、nodeStackからpopする
        if ((lastNode as ElementNode).tagName === curToken.TagName) {
          this.nodeStack.pop()
          // 最後の一つの要素(rootNode)だけになったらastとして返す
          if (this.nodeStack.length === 1) {
            this.ast = this.nodeStack[0]
          }
        } else {
          throw new Error("No corresponding closing tag.")
        }
        break;
      default:
    }
  }
  
  createNode(token: Token): ElementNode | TextNode {
    switch(token.Type) {
      case TokenTypes.DOCTYPE:
        const rootNode: ElementNode = {
          type: 'document',
          tagName: '!DOCTYPE',
          attributes: token.Attributes,
          children: []
        }
        return rootNode
      case TokenTypes.Start:
        const elementNode: ElementNode = {
          type: 'element',
          tagName: token.TagName,
          attributes: token.Attributes,
          children: []
        }
        return elementNode
      case TokenTypes.Text:
        const textNode: TextNode = {
          type: 'text',
          content: token.Content,
        }
        return textNode
      case TokenTypes.SelfClosing:
        const selfClosingNode: ElementNode = {
          type: 'element',
          tagName: token.TagName,
          attributes: token.Attributes,
        }
        return selfClosingNode
      default:
    }
  }
}
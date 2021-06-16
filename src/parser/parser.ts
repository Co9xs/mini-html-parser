import { Attribute, Token, TokenType } from "../token/token"

type NodeType = 'document' | 'element' | 'text'

interface Node {
  type: NodeType
}

export interface RootNode extends Node {
  type: 'document',
  tagName: '!DOCTYPE',
  children:  (ElementNode | TextNode)[],
  attributes?: Attribute[]
}

export interface ElementNode extends Node {
  type: 'element'
  tagName: string
  children?: (ElementNode | TextNode)[]
  attributes?: Attribute[]
}

export interface TextNode extends Node {
  type: 'text'
  content: string
}

export class Parser {
  tokenStack: Token[]
  nodeStack: [RootNode, ...(ElementNode | TextNode)[]]
  ast: RootNode | null

  constructor(tokens: Token[]) {
    this.tokenStack = [...tokens]
    const rootNode = this.createNode(this.tokenStack[tokens.length -1])
    this.nodeStack = [rootNode as RootNode]
    this.ast = null
  }

  emit(): void {
    const curToken = this.tokenStack.pop()
    const lastNode = this.nodeStack[this.nodeStack.length - 1]
    switch(curToken.type) {
      case TokenType.Start:
        const startNode = this.createNode(curToken);
        (lastNode as ElementNode).children.push(startNode as ElementNode);
        this.nodeStack.push(startNode)
        break;
      case TokenType.Text:
        const textNode = this.createNode(curToken);
        (lastNode as ElementNode).children.push(textNode as TextNode)
        break;
      case TokenType.SelfClosing:
        const selfClosingNode = this.createNode(curToken);
        (lastNode as ElementNode).children.push(selfClosingNode as ElementNode)
        break;
      case TokenType.End:
        // 現在のtokenとnodeStackの先頭要素を比較して対応していれば、nodeStackからpopする
        if ((lastNode as ElementNode).tagName === curToken.tagName) {
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
  
  createNode(token: Token): RootNode | ElementNode | TextNode {
    switch(token.type) {
      case TokenType.DOCTYPE:
        const rootNode: RootNode = {
          type: 'document',
          tagName: '!DOCTYPE',
          attributes: token.attributes,
          children: []
        }
        return rootNode
      case TokenType.Start:
        const elementNode: ElementNode = {
          type: 'element',
          tagName: token.tagName,
          attributes: token.attributes,
          children: []
        }
        return elementNode
      case TokenType.Text:
        const textNode: TextNode = {
          type: 'text',
          content: token.content,
        }
        return textNode
      case TokenType.SelfClosing:
        const selfClosingNode: ElementNode = {
          type: 'element',
          tagName: token.tagName,
          attributes: token.attributes,
        }
        return selfClosingNode
      default:
    }
  }
}
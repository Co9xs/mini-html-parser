import { Attribute, Token, TokenTypes } from "../token/token"

type NodeType = 'document' | 'element' | 'text' | 'EOF'

interface Node {
  type: NodeType
}

interface ElementNode extends Node {
  tagName: string
  children?: (ElementNode | TextNode)[]
  attributes?: Attribute[]
}

interface TextNode extends Node {
  content: string
}

export class Parser {
  tokenStack: Token[]
  nodeStack: (ElementNode | TextNode)[]
  resultStack: (ElementNode | TextNode)[]

  constructor(tokens: Token[]) {
    this.tokenStack = [...tokens]
    this.nodeStack = []
    this.resultStack = []
  }

  emit(): void {
    const curToken = this.tokenStack.pop()
    const lastNode = this.nodeStack[this.nodeStack.length - 1]
    switch(curToken.Type) {
      case TokenTypes.DOCTYPE:
        const rootNode = this.createNode(curToken);
        this.nodeStack.push(rootNode)
        this.resultStack.push(rootNode)
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
        if ((lastNode as ElementNode).tagName === curToken.TagName) {
          this.resultStack.push(this.nodeStack.pop())
          if (this.nodeStack.length === 1) {
            this.resultStack.push(this.nodeStack[0])
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
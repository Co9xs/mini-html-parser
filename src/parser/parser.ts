import { Attribute, Token, TokenTypes } from "../token/token"

type NodeType = 'document' | 'element' | 'text' | 'EOF'

type Node = {
  type: NodeType
  tagName?: string,
  children?: Node[]
  attributes?: Attribute[]
  content?: string
}

export class Parser {
  tokenStack: Token[]
  nodeStack: Node[]
  result: any[] = []
  constructor(tokens: Token[]) {
    this.tokenStack = [...tokens]
    this.nodeStack = [{
      type: "document",
      children: []
    }]
  }

  emit() {
    const curToken = this.tokenStack.pop()
    let lastNode = this.nodeStack[this.nodeStack.length - 1]
    switch(curToken.Type) {
      case TokenTypes.Start:
        const startNode = this.createNode(curToken)
        lastNode.children.push(startNode)
        this.nodeStack.push(startNode)
        break;
      case TokenTypes.Text:
        const textNode = this.createNode(curToken)
        lastNode.children.push(textNode)
        break;
      case TokenTypes.End:
        const endNode = this.createNode(curToken)
        if (lastNode.tagName === endNode.tagName) {
          this.result.push(this.nodeStack.pop())
        }
        break;
      default:
    }
  }

  createNode(token: Token): Node {
    switch(token.Type) {
      case TokenTypes.DOCTYPE:
        return {
          type: 'document',
          tagName: token.TagName,
          children: [],
        }
      case TokenTypes.Start:
        return {
          type: 'element',
          tagName: token.TagName,
          attributes: token.Attributes,
          children: []
        }
      case TokenTypes.End:
        return {
          type: 'element',
          tagName: token.TagName,
          children: []
        }
      case TokenTypes.Text:
        return {
          type: 'text',
          content: token.Content,
          children: []
        }
      case TokenTypes.EOF:
        return {
          type: 'EOF'
        }
      default:
    }
  }
}
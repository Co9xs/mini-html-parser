import { Attribute, Token, TokenTypes } from "../token/token"

type NodeType = 'document' | 'element' | 'text' | 'EOF'

type Node = {
  type: NodeType
  tagName?: string,
  children?: Node[]
  attributes?: Attribute[]
}

export class Parser {
  tokenStack: Token[]
  nodeStack: Node[]
  constructor(tokens: Token[]) {
    this.tokenStack = [...tokens]
    this.nodeStack = []
  }

  emit() {
    const curToken = this.tokenStack.pop()
    let nodeLen
    switch(curToken.Type) {
      case TokenTypes.DOCTYPE:
        const documentRoot = this.createNode(curToken)
        this.nodeStack.push(documentRoot)
      case TokenTypes.Start:
        const startNode = this.createNode(curToken)
        nodeLen = this.nodeStack.length
        this.nodeStack[0].children.push(startNode)
        this.nodeStack.push(startNode)
      case TokenTypes.Text:
        const textNode = this.createNode(curToken)
        this.nodeStack[0].children.push(textNode)
      case TokenTypes.End:
        const endNode = this.createNode(curToken)
        if (this.nodeStack[0].tagName === endNode.tagName) {
          this.nodeStack.pop()
        }
    }
  }

  // createNodeでNodeを作ってnodeStackの先頭の子要素に追加していく
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
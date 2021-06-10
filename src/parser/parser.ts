import { Attribute, Token, TokenTypes } from "../token/token"

type NodeType = 'document' | 'element' | 'text' | 'EOF'

type Node = {
  type: NodeType
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
    switch(curToken.Type) {
      case TokenTypes.DOCTYPE:
        const documentRoot = this.createNode(curToken)
        this.nodeStack.push(documentRoot)
      case TokenTypes.Start:
        const curNode = this.createNode(curToken)
        this.nodeStack[0].children.push(curNode)
    }
  }

  createNode(token: Token): Node {
    switch(token.Type) {
      case TokenTypes.DOCTYPE:
        return {
          type: 'document',
          children: [],
        }
      case TokenTypes.Start:
        return {
          type: 'element',
          attributes: token.Attributes,
          children: []
        }
      case TokenTypes.End:
        return {
          type: 'element',
          children: []
        }
      case TokenTypes.Char:
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
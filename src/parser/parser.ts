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
  result: (ElementNode | TextNode)[]

  // pass tokens to tokenStack
  constructor(tokens: Token[]) {
    this.tokenStack = [...tokens]
    this.nodeStack = []
    this.result = []
  }

  // The emit function checks the beginning of the tokenStack.(ex: stack.pop())
  // In the case of startTag, it creates a Node, push it to children of the nodeStack's beginning element, and then push the created Node itself to the nodeStack.

  // For the endTag, we do not create a Node, but check the tag name of the current Token and the tag name of the first element of the nodeStack, and if they match, we move the first element of the nodeStack to the resultStack.
  // If the tag names do not match it will throw an error, because it means there is no corresponding closing tag.

  // In the case of the Text tag, it doesn't have any child elements, so we create a Node, but we don't push it to the nodeStack itself, we just push it to the children of the nodeStack's combat element.

  emit(): void {
    const curToken = this.tokenStack.pop()
    const lastNode = this.nodeStack[this.nodeStack.length - 1]
    switch(curToken.Type) {
      case TokenTypes.DOCTYPE:
        const rootNode = this.createNode(curToken);
        this.nodeStack.push(rootNode)
        this.result.push(rootNode)
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
      case TokenTypes.End:
        if ((lastNode as ElementNode).tagName === curToken.TagName) {
          this.result.push(this.nodeStack.pop())
          if (this.nodeStack.length === 1) {
            this.result.push(this.nodeStack[0])
          }
        } else {
          throw new Error("No corresponding closing tag.")
        }
        break;
      default:
    }
  }

  // Create a Node corresponding to the given token.
  // In the case of EndTag, there is no need to create a Node, so there is no case branch.
  
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
      default:
    }
  }
}
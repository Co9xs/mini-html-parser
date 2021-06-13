import { RootNode, ElementNode, TextNode } from "../parser/parser"
require('jsdom-global')()

type NodeType = RootNode | ElementNode | TextNode
type Nullable<T> = T | null
export class Evaluator {
  ast: RootNode

  constructor(ast: RootNode) {
    this.ast = ast
  }

  eval(parent: RootNode | ElementNode | null, children: any) {
    const parentElement = parent ? document.createElement(parent.tagName) : null
    for (const node of children) {
      if (node.type === "element") {
        const elementNode = node.children ? this.eval(node, node.children) : document.createElement(node.tagName)
        node.attributes.forEach(attr => {
          elementNode.setAttribute(attr.name, attr.value as string)
        })
        console.log(parentElement, elementNode)
        if (parentElement) parentElement.appendChild(elementNode)
      } else if (node.type === "text") {
        const textNode = document.createTextNode(node.content)
        console.log(parentElement, textNode)
        if (parentElement) parentElement.appendChild(textNode)
      }
    }
    return parentElement
  }

  test() {
    const p = document.createElement('div')
    const c = document.createElement('p')
    const t = document.createTextNode("Hello World!!")
    c.appendChild(t)
    p.appendChild(c)
    p.setAttribute("class", "container")
    return p
  }
}
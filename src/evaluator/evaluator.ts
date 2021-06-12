import { RootNode, ElementNode, TextNode } from "../parser/parser"

export class Evaluator {
  ast: RootNode

  constructor(ast: RootNode) {
    this.ast = ast
  }

  eval(children: (RootNode | ElementNode | TextNode)[]): void {
    for (const node of children) {
      console.log(node)
      if (node.type !== "text") {
        if (node.children) {
          this.eval(node.children)
        }
      }
    }
  }

}
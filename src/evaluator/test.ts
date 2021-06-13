class Test {
  eval (parent, children) {
    const parentElement = document.createElement(parent.tagName)
    for (const node of children) {
      if (node.type === "element") {
        if (node.children) {
          const p = this.eval(node, node.children)
          p.attributes.forEach(attr => {
            p.setAttribute(attr.name, attr.value)
          })
          parentElement.appendChild(p)
        } else {
          const elementNode = document.createElement(node.tagName)
          node.attributes.forEach(attr => {
            elementNode.setAttribute(attr.name, attr.value)
          })
          parentElement.appendChild(elementNode)
        }
      }
      if (node.type === "text") {
        const textNode = document.createTextNode(node)
        parentElement.appendChild(textNode)
      }
    }
    return parentElement
  }
}


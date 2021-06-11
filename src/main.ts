import { Lexer } from './lexer/lexer'
import { Parser } from './parser/parser'
import { Token, TokenTypes } from './token/token'

const input = `
<!DOCTYPE html="true">
<html lang="en">
<head>
  <title>Document</title>
</head>
<body>
  <div class="container w-1080">
    <p class="link-block w-120">
      <a href="https://example.com">リンク</a>
    </p>
    <ul class="name-list p-0 m-0">
      <li class="name-list__item">リスト1</li>
      <li class="name-list__item">リスト2</li>
      <li class="name-list__item">リスト3</li>
    </ul>
  </div>
</body>
</html>
`

// tokenize input string
const lexer = new Lexer(input)
const tokens: Token[] = []
for (let token = lexer.nextToken(); token.Type !== TokenTypes.EOF; token = lexer.nextToken()) {
  tokens.unshift(token)
}

// parse token to ast
const parser = new Parser(tokens)
for (let i = 0; i < tokens.length; i++) {
  parser.emit()
}

// print ast as json
const ast = JSON.stringify(parser.result.pop(), null , " ")
console.log(ast)

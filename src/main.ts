import { Lexer } from './lexer/lexer'
import { Parser } from './parser/parser'
import { Token, TokenTypes } from './token/token'

const input = `
<div class="container w-100">
  <p class="button">
    <a href="https://example.com">link</a>
  </p>
</div>
`
const lexer = new Lexer(input)

const tokens: Token[] = []

// tokenize input string
for (let token = lexer.nextToken(); token.Type !== TokenTypes.EOF; token = lexer.nextToken()) {
  tokens.unshift(token)
}

// parse token to ast
const parser = new Parser(tokens)

for (let i = 0; i < 7; i++) {
  parser.emit()
}

console.log(JSON.stringify(parser.result.pop()))

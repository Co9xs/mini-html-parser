import { Evaluator } from './evaluator/evaluator'
import { Lexer } from './lexer/lexer'
import { Parser } from './parser/parser'
import { Token, TokenTypes } from './token/token'

const input = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
</html>
`

// tokenize input string and unshift to token array.(order: EOF → DOCTYPE)
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
const astJson = JSON.stringify(parser.ast, null, " ")
// console.log(astJson)

// pass ast to evaluator
const ast = parser.ast
const evaluator = new Evaluator(ast)
const r = evaluator.test()
console.log(r)
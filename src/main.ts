import { Evaluator } from './evaluator/evaluator'
import { Lexer } from './lexer/lexer'
import { Parser } from './parser/parser'
import { Token, TokenTypes } from './token/token'

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const input = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <img src="./hogehoge.png" alt="画像">
  <button class="cta-button aaa" disabled>ボタン</button>
  <a href="https://example.com" aria-dialog class="link-test">リンク</a><br/>
  <hr/>
</body>
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
evaluator.eval([ast])
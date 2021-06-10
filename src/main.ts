import { Lexer } from './lexer/lexer'
import { TokenTypes } from './token/token'

const input = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  Bodyのコンテンツ
</body>
</html>
`
const lexer = new Lexer(input)

for (let token = lexer.nextToken(); token.Type !== TokenTypes.EOF; token = lexer.nextToken()) {
  console.log(token)
}
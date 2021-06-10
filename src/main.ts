import { Lexer } from './lexer/lexer'
import { TokenTypes } from './token/token'

const input = `
<!DOCTYPE html="true">
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" aria-dialog="true" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <p class="mt-2 pb-5 name">段落</p>
</body>
</html>
`
const lexer = new Lexer(input)

for (let token = lexer.nextToken(); token.Type !== TokenTypes.EOF; token = lexer.nextToken()) {
  console.log(token)
}
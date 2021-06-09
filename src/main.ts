import { Lexer } from './lexer/lexer'
import { TokenTypes } from './token/token'

const input = `<!DOCTYPE lang="en"><html>test</html>`
const lexer = new Lexer(input)

for (let token = lexer.nextToken(); token.Type !== TokenTypes.EOF; token = lexer.nextToken()) {
  console.log(token)
}
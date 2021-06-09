import { Lexer } from './lexer/lexer'

const input = "<html>test</html>"
const lexer = new Lexer(input)

for (let i = 0; i < input.length; i++) {
  console.log(lexer.nextToken())
}
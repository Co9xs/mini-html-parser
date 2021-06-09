import { Token, TokenTypes } from "../token/token"

const EOF = 0
export class Lexer {
  input: string
  position: number
  nextPosition: number
  character: string | typeof EOF

  constructor(input: string) {
    this.input = input
    this.position  = 0
    this.nextPosition = 1
    this.character = input[this.position]
  }

  readChar(): void {
    if (this.nextPosition >= this.input.length) {
      this.character = EOF
    } else {
      this.character = this.input[this.nextPosition]
    }
    this.position = this.nextPosition
    this.nextPosition += 1
  }

  peekChar(): string | typeof EOF  {
    if (this.nextPosition >= this.input.length) {
      return EOF
    } else {
      return this.input[this.nextPosition]
    }
  }

  nextToken(): Token {
    let token: Token = {
      Type: null,
      Literal: null
    }
    switch(this.character) {
      case "<":
        if (this.peekChar() === "/") {
          token.Type = TokenTypes.End
          token.Literal = this.readTagName()
        } else if (this.peekChar() === "!") {
          token.Type = TokenTypes.DOCTYPE
          token.Literal = this.readTagName()
        } else {
          token.Type = TokenTypes.Start
          token.Literal = this.readTagName()
        }
        break;
      case EOF:
        token.Type = TokenTypes.EOF,
        token.Literal = ""
        break;
      default:
        token.Type = TokenTypes.Char,
        token.Literal = this.readString()
    }
    this.readChar()
    return token
  }

  readTagName(): string {
    const position = this.position
    while (this.character !== ">") {
      this.readChar()
    }
    return this.input.slice(position, this.position + 1)
  }

  readString(): string {
    const position = this.position
    while (this.peekChar() !== "<") {
      this.readChar()
    }
    return this.input.slice(position, this.position + 1)
  }
}
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

  // 現在の文字に応じてトークンを生成する
  nextToken(): Token {
    let token: Token = {
      Type: null,
      Literal: null
    }
    this.skipWhitespace()
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

  // 現在位置を一文字すすめる(最後はEOF=0)
  readChar(): void {
    if (this.nextPosition >= this.input.length) {
      this.character = EOF
    } else {
      this.character = this.input[this.nextPosition]
    }
    this.position = this.nextPosition
    this.nextPosition += 1
  }

  // 位置は進めずに次の文字だけを返す(先読み)
  peekChar(): string | typeof EOF  {
    if (this.nextPosition >= this.input.length) {
      return EOF
    } else {
      return this.input[this.nextPosition]
    }
  }

  // "<"から始まる時は">"にぶつかるまでタグ名として読む
  readTagName(): string {
    const position = this.position
    while (this.character !== ">") {
      this.readChar()
    }
    return this.input.slice(position, this.position + 1)
  }

  // "<"にぶつかるまで純粋な文字列として読む
  readString(): string {
    const position = this.position
    while (this.peekChar() !== "<") {
      this.readChar()
    }
    return this.input.slice(position, this.position + 1)
  }
    
  // 空白、改行文字の場合は飛ばす
  skipWhitespace() {
    while ([" ", "\n", "\t", "\r"].includes(this.character as string)) {
      this.readChar()
    }
  }
}
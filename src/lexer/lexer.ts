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
    }
    this.skipWhitespace()
    switch(this.character) {
      case "<":
        if (this.peekChar() === "/") {
          token.Type = TokenTypes.End
          token.TagName = this.readEndTagName()
        } else if (this.peekChar() === "!") {
          token.Type = TokenTypes.DOCTYPE
          token.TagName = this.readStartTagName()
          this.skipWhitespace()
          const key = this.readKey()
          this.eatEqual()
          const value = this.readValue()
          if (key) token[key] = value
        } else {
          token.Type = TokenTypes.Start
          token.TagName = this.readStartTagName()
          this.skipWhitespace()
          const key = this.readKey() || undefined
          this.eatEqual()
          const value = this.readValue()
          if (key) token[key] = value
        }
        break;
      case ">":
        this.readChar()
        break;
      case EOF:
        token.Type = TokenTypes.EOF
        break;
      default:
        token.Type = TokenTypes.Char
        token.Literal = this.readString().trim()
    }
    this.readChar()
    return token
  }

  readKey(): string {
    const position = this.position
    this.skipWhitespace()
    while (this.character !== "=" && this.character !== ">" && this.character !== " ") {
      this.readChar()
    }
    console.log(position, this.position)
    return this.input.slice(position, this.position)
  }

  eatEqual(): void {
    if (this.character === "=") {
      this.readChar()
    }
  }

  readValue(): string | boolean {
    const position = this.position
    this.skipWhitespace()
    while (this.character !== ">" && this.character !== " ") {
      this.readChar()
    }
    // 一文字も進んでいないのならkeyだけの属性とみなしてtrueを暗黙的に設定する
    return position === this.position ? true : this.input.slice(position+1, this.position-1)
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

  readStartTagName(): string {
    const position = this.position
    while (this.character !== " " && this.character !== ">") {
      this.readChar()
    }
    return this.input.slice(position + 1, this.position)
  }

  readEndTagName(): string {
    const position = this.position
    while (this.character !== " " && this.character !== ">") {
      this.readChar()
    }
    return this.input.slice(position + 2, this.position)
  }

  readString(): string {
    const position = this.position
    this.skipWhitespace()
    while (this.peekChar() !== "=" && this.peekChar() !== ">" && this.peekChar() !== "<") {
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
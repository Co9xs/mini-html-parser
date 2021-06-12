import { Token, TokenTypes } from "../token/token"
const selfClosingTags = ["br", "input", "img", "hr", "link", "meta"]
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

  nextToken(): Token {
    let token: Token = {
      Type: null,
      Attributes: []
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
          this.setAttributes(token)
        } else {
          token.TagName = this.readStartTagName()
          if (selfClosingTags.includes(token.TagName)) {
            token.Type = TokenTypes.SelfClosing
          } else {
            token.Type = TokenTypes.Start
          }
          this.setAttributes(token)
        }
        break;
      case ">":
        this.readChar()
        break;
      case EOF:
        token.Type = TokenTypes.EOF
        break;
      default:
        token.Type = TokenTypes.Text
        token.Content = this.readString().trim()
    }
    this.readChar()
    return token
  }

  setAttributes(token: Token): void {
    while(this.character !== ">") {
      this.setAttribute(token)
    }
  }

  setAttribute(token: Token): void {
    this.skipWhitespace()
    this.skipSlash()
    const key = this.readKey()
    // keyを読んだあとに、現在の文字が"="であればkey=valueの属性として解析
    if (key && this.character === "=") {
      this.eatEqual()
      const value = this.readValue()
      token.Attributes.push({
        name: key,
        value: value
      })
    // keyを読んだあとに、現在の文字が " " or ">" であればkeyのみの属性として解析
    } else if (key && (this.character === ">" || this.character === " ")) {
      token.Attributes.push({
        name: key,
        value: true
      })
    }
  }

  readKey(): string {
    const position = this.position
    this.skipWhitespace()
    while (this.character !== "=" && this.character !== ">" && this.character !== " ") {
      this.readChar()
    }
    return this.input.slice(position, this.position)
  }

  eatEqual(): void {
    if (this.character === "=") {
      this.readChar()
    }
  }

  eatQuotation() {
    if (this.character === '"') {
      this.readChar()
    }
  }

  readValue(): string | boolean {
    this.eatQuotation()
    const position = this.position
    do {
      this.readChar()
      if (this.character === `"`) {
        this.eatQuotation()
        break
      }
    } while (this.character !== `"`)
    return this.input.slice(position, this.position-1)
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

  readStartTagName(): string {
    const position = this.position
    while (this.character !== " " && this.character !== ">" && this.character !== "/") {
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
    
  skipWhitespace() {
    while ([" ", "\n", "\t", "\r"].includes(this.character as string)) {
      this.readChar()
    }
  }

  skipSlash() {
    while (["/"].includes(this.character as string)) {
      this.readChar()
    }
  }
}
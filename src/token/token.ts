type TokenType = "StartTag" | "EndTag" | "DOCTYPE" | "EOF" | "Character"

export type Token = {
  Type: TokenType | null, 
  Literal: string | null
}

export const TokenTypes: {
  [key: string]: TokenType
} = {
  DOCTYPE: "DOCTYPE",
  Start: "StartTag",
  Char: "Character",
  End: "EndTag",
  EOF: "EOF",
}

export interface TagToken extends Token {
  tagName: string
  attr: {[key: string]: number | boolean | string}[]
}

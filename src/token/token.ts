type TokenType = "StartTag" | "EndTag" | "DOCTYPE" | "EOF" | "Character"

export type Token = {
  Type: TokenType | null, 
  Literal?: string
  TagName?: string
  [key: string]: string | boolean
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

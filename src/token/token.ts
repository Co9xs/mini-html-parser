type TokenType = "StartTag" | "EndTag" | "DOCTYPE" | "EOF" | "Character"

export type Attribute = {
  name: string
  value: string | number | boolean
}

export type Token = {
  Type: TokenType | null,
  Content?: string
  TagName?: string
  Attributes?: Attribute[]
}

export const TokenTypes = {
  DOCTYPE: "DOCTYPE",
  Start: "StartTag",
  Char: "Character",
  End: "EndTag",
  EOF: "EOF",
} as const

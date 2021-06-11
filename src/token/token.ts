type TokenType = "DOCTYPE" | "StartTag" | "EndTag" | "Text" | "EOF"

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
  Text: "Text",
  End: "EndTag",
  EOF: "EOF",
} as const

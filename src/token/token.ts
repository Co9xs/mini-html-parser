type TokenType = "startTag" | "endTag" | "character" |  "DOCTYPE" | "EOF"

export type Token = {
  Type: TokenType,
  Literal: string
}

export const tokens = {
  LT: "<",
	GT: ">",
  ASSIGN: "=",
  IDENT: "IDENT",
  BANG : "!"
} as const
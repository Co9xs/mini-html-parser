export enum TokenType {
  DOCTYPE,
  Start,
  Text,
  End,
  SelfClosing,
  EOF
}

export type Attribute = {
  name: string
  value: string | number | boolean
}

export type Token = {
  Type: TokenType | null
  Content?: string
  TagName?: string
  Attributes?: Attribute[]
}

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
  type: TokenType | null
  content?: string
  tagName?: string
  attributes?: Attribute[]
}

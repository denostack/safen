import { Scalar } from "./common"


export type AstValue = AstObject
  | AstExpr
  | AstTester

export interface AstObject {
  t: 1
  p: AstObjectPair[]
}

export interface AstObjectPair {
  k: AstKey
  v: AstValue
}

export interface AstKey {
  n: string // name
  l: Array<[string|null, string|null]|string|null> // length
  o: boolean // optional
}

export interface AstExpr {
  t: 2
  n: "or" | "and"
  p: Array<AstExpr | AstTester>
}

export interface AstTester {
  t: 4
  n: string
  p: Scalar[]
}

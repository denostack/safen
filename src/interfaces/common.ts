
export type Scalar = string | number | boolean | null

export type Tester = (value: string, params: Scalar[], generateVariable: () => string) => string

export interface TesterMap {
  [name: string]: Tester
}

export interface MessageMap {
  [key: string]: [string, string]
}

export type Rule = string | RuleObject | RuleInvoker
export type RuleInvoker = () => Rule
export interface RuleObject {
  [key: string]: RuleObject | Rule
}



export interface Tester {
  template(value: string, params: string[]): string
}

export interface TesterMap {
  [name: string]: Tester
}

export type Rule = string | RuleObject | RuleInvoker
export type RuleInvoker = () => Rule
export interface RuleObject {
  [key: string]: RuleObject | Rule
}

export interface MessageMap {
  [key: string]: string | [string, string]
}
export interface MessageLoader {
  load(reason: string): string
}

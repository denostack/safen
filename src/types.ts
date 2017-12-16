
export type TesterNewable = Array<[{new(): Tester}, any[]] | {new(): Tester}>

export interface Tester {
  before?(data: any, origin?: any, keys?: string[]): TesterNewable,
  test(data: any, origin?: any, keys?: string[]): boolean
}

export interface ErrorThowable {
  throws(type: string, keys: string[]): void
}
export type ValidatingErrors = string[]

export type NormalizableRule = string | NormalizableRuleObject | Array<string|NormalizableRuleObject> | NormalizableInvoker
export type NormalizableInvoker = () => NormalizableRule | NormalizableInvoker

export interface NormalizableRuleObject {
  [key: string]: NormalizableRuleObject | NormalizableRule
}

export type NormalizedTargetName = [string, Array<string|null>, boolean]

export type NormalizedRule = [string[], NormalizedChildRules]
export interface NormalizedChildRules extends Array<[NormalizedTargetName, NormalizedRule]> {}


export interface TesterMap {
  [key: string]: {new(): Tester}
}
export interface TesterCacheMap {
  [key: string]: Tester
}
export interface TesterLoader {
  load(tester: string): Tester
}


export interface MessageMap {
  [key: string]: string | [string, string]
}
export interface MessageLoader {
  load(reason: string): string
}

export interface SafenCreateOptions {
  testers?: TesterMap
  messages?: MessageMap
}

export interface MiddlewareResponseFactory {
  factory(errors: ValidatingErrors): any
}

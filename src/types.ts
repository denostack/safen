
export interface Tester {
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

export type NormalizedTargetName = [string, Array<number|null>, boolean]

export type NormalizedRule = [string[], NormalizedChildRules]
export interface NormalizedChildRules extends Array<[NormalizedTargetName, NormalizedRule]> {}

export interface TesterMap {
  [key: string]: {new(): Tester}
}
export interface TesterCacheMap {
  [key: string]: Tester
}

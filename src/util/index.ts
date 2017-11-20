
import * as types from "../types"
import * as _ from "lodash"

const TARGET_NAME_PATTERN = /^([a-zA-Z_][a-zA-Z0-9_-]*)((?:\[\d*\])*)(\?)?$/u

export function parse(target: string): types.NormalizedTargetName {
  if (!TARGET_NAME_PATTERN.test(target)) {
    const correction = target.match(/([a-zA-Z_][a-zA-Z0-9_-]*)((?:\[\d*\])*)(\?)/u)
    throw new Error(`Invalid target name. Did you mean this? '${(correction && correction[0]) || "unknown"}'.`)
  }
  const matches = target.match(TARGET_NAME_PATTERN)

  let iterators: Array<number|null> = []
  if (matches && matches[2]) {
    iterators = matches[2].replace(/((^\[)|(\]$))/g, "").split("][").map(chunk => (chunk === "" ? null : +chunk))
  }
  return [
    (matches && matches[1]) || "",
    iterators,
    !!(matches && matches[3]),
  ]
}

export function normalize(rule: types.NormalizableRule): types.NormalizedRule {
  while (_.isFunction(rule)) {
    rule = rule()
  }
  if (_.isString(rule)) {
    return [[rule], []]
  }
  if (_.isPlainObject(rule)) {
    rule = [rule] as Array<string|types.NormalizableRuleObject>
  }

  // normalized logic!
  const normalized: types.NormalizedRule = [[], []]
  for (const entry of (rule as Array<string|types.NormalizableRuleObject>)) {
    if (_.isString(entry)) {
      normalized[0].push(entry)
      continue
    }
    for (const index of Object.keys(entry)) {
      normalized[1].push([parse(index), normalize(entry[index])])
    }
  }
  return normalized
}

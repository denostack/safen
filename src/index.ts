
import {Validator} from "./Validator"
import {InvalidValueError} from "./InvalidValueError"
import {NormalizableRule} from "./types"

export * from "./Validator"
export * from "./InvalidValueError"
export * from "./types"

export function create(rules: NormalizableRule): Validator {
  return new Validator(rules)
}

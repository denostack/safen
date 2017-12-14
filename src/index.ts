
import {Validator} from "./Validator"
import {InvalidValueError} from "./InvalidValueError"
import {Loader} from "./Loader"
import {NormalizableRule} from "./types"

export * from "./Validator"
export * from "./InvalidValueError"
export * from "./Loader"
export * from "./types"

export function create(rules: NormalizableRule): Validator {
  return new Validator(new Loader(), rules)
}

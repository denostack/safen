
import Validator from "./Validator"
import Loader from "./Loader"
import * as types from "./types"

export function create(rules: types.NormalizableRule): Validator {
  return new Validator(new Loader(), rules)
}

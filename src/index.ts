
import Validator from "./Validator"
import Loader from "./Loader"
import * as types from "./types"

export {default as InvalidValueError} from "./InvalidValueError"

export function create(rules: types.NormalizableRule): Validator {
  return new Validator(new Loader(), rules)
}

export default {
  create,
}

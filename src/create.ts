
import { NormalizableRule, SafenCreateOptions } from "./interfaces/tester"
import { defaultMessages, MapLoader as MessageLoader } from "./message-loader/MapLoader"
import { defaultTesters, MapLoader as TesterLoader } from "./tester-loader/MapLoader"
import { Validator } from "./validator/validator"

export function create(rules: NormalizableRule, options?: SafenCreateOptions): Validator {
  const testerLoader = (options && options.testers)
    ? new TesterLoader(Object.assign({}, defaultTesters, options.testers))
    : undefined
  const messageLoader = (options && options.messages)
    ? new MessageLoader(Object.assign({}, defaultMessages, options.messages))
    : undefined
  return new Validator(rules, testerLoader, messageLoader)
}

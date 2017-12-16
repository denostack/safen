
import {Validator} from "./Validator"
import {InvalidValueError} from "./InvalidValueError"
import {NormalizableRule, SafenCreateOptions} from "./types"
import {MapLoader as TesterLoader, defaultTesters} from "./tester-loader/MapLoader"
import {MapLoader as MessageLoader, defaultMessages} from "./message-loader/MapLoader"

export * from "./Validator"
export * from "./InvalidValueError"
export * from "./types"

export function create(rules: NormalizableRule, options?: SafenCreateOptions): Validator {
  const testerLoader = (options && options.testers)
    ? new TesterLoader(Object.assign({}, defaultTesters, options.testers))
    : undefined
  const messageLoader = (options && options.messages)
    ? new MessageLoader(Object.assign({}, defaultMessages, options.messages))
    : undefined
  return new Validator(rules, testerLoader, messageLoader)
}

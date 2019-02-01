import { messages as defaultMessages } from "./constants/messages"
import { testers as defaultTesters } from "./constants/testers"
import { MessageMap, Rule, TesterMap } from "./interfaces/common"
import { parse } from "./sfl/parser"
import { Validator } from "./validator/validator"


export interface CreateOptions {
  testers?: TesterMap
  messages?: MessageMap
}

export function create(rule: string, {testers, messages}: CreateOptions = {}): Validator {
  return new Validator(
    parse(rule),
    Object.assign({}, defaultTesters, testers),
    Object.assign({}, defaultMessages, messages)
  )
}

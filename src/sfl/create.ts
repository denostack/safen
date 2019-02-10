import { messages as defaultMessages } from "../constants/messages"
import { testers as defaultTesters } from "../constants/testers"
import { MessageMap, TesterMap } from "../interfaces/common"
import { Validator } from "../validator/validator"
import { parse } from "./parser"


export interface CreateOptions {
  testers?: TesterMap
  messages?: MessageMap
}

export function create<P = any>(rule: string, {testers, messages}: CreateOptions = {}): Validator {
  return new Validator<P>(
    parse(rule),
    Object.assign({}, defaultTesters, testers),
    Object.assign({}, defaultMessages, messages)
  )
}

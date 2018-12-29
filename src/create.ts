import { MessageMap, Rule, TesterMap } from "./interfaces/common"
import { messages as defaultMessages } from "./messages"
import { testers as defaultTesters } from "./testers"
import { Validator } from "./validator/validator"


export interface CreateOptions {
  testers?: TesterMap
  messages?: MessageMap
}

export function create(rule: Rule, {testers, messages}: CreateOptions = {}): Validator {
  return new Validator(
    rule,
    testers || defaultTesters,
    messages || defaultMessages
  )
}

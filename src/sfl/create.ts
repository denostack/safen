import { messages as defaultMessages } from '../constants/messages'
import { testers as defaultTesters } from '../constants/testers'
import { MessageMap, TesterMap } from '../interfaces/common'
import { Validator } from '../validator/validator'
import { parse } from './parse'


export interface CreateOptions {
  testers?: TesterMap
  messages?: MessageMap
}

export function create<T = any>(rule: string, { testers, messages }: CreateOptions = {}): Validator<T> {
  return new Validator<T>(
    parse(rule),
    Object.assign({}, defaultTesters, testers),
    Object.assign({}, defaultMessages, messages)
  )
}

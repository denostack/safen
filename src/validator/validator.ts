import { InvalidValueError } from "../errors/invalid-value-error"
import { generateAssert, generateValidate } from "../generator/generate"
import { MessageMap, Rule, TesterMap } from "../interfaces/common"
import { InvalidValueErrorReason } from "../interfaces/error"
import { parse } from "../parser/parse"

function getMessage(messages: MessageMap, path: string, reason: string, params: string[]) {
  let message = (messages[reason] || ["something wrong", "something wrong"])[path ? 0 : 1]
  message = message.replace(":path", path)
  params.forEach((param, index) => {
    message = message.replace(`:param${index}`, param)
  })
  return message.replace(/\:param[0-9]+/g, "")
}

export class Validator {

  public validate: (data: any) => boolean

  public assertInner: (data: any) => {[path: string]: Array<[string, string[]]>}

  constructor(public rule: Rule, testers: TesterMap, public messages: MessageMap) {
    const parsed = parse(rule)
    this.validate = generateValidate(parsed, testers)
    this.assertInner = generateAssert(parsed, testers)
  }

  public assert(data: any) {
    const errors = this.assertInner(data)
    const keys = Object.keys(errors)
    if (keys.length) {
      throw new InvalidValueError(keys.reduce((carry, key) => ([
        ...carry,
        ...errors[key].map(([reason, params]) => ({
          path: key,
          reason,
          params: params.map(param => JSON.parse(param)),
          message: getMessage(this.messages, key, reason, params),
        })),
      ]), [] as InvalidValueErrorReason[]))
    }
  }
}

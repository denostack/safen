import { InvalidValueError } from "../errors/invalid-value-error"
import { generateAssert, generateValidate } from "../generator/generate"
import {
  MessageMap,
  Rule,
  Scalar,
  TesterMap
  } from "../interfaces/common"
import { InvalidValueErrorReason } from "../interfaces/error"
import { parse } from "../parser/parse"

function getMessage(messages: MessageMap, path: string, reason: string, params: Scalar[]) {
  let message = (messages[reason] || ["something wrong", "something wrong"])[path ? 0 : 1]
  message = message.replace(":path", path)
  params.forEach((param, index) => {
    message = message.replace(`:param${index}`, JSON.stringify(param))
  })
  return message.replace(/\:param[0-9]+/g, "").replace(/\:params/g, JSON.stringify(params))
}

export class Validator {

  public rawValidate: (data: any) => boolean
  public rawAssert: (data: any) => {[path: string]: Array<[string, Scalar[]]>}

  constructor(public rule: Rule, testers: TesterMap, public messages: MessageMap) {
    const parsed = parse(rule)
    this.rawValidate = generateValidate(parsed, testers)
    this.rawAssert = generateAssert(parsed, testers)
  }

  public validate(data: any): boolean {
    return this.rawValidate(data)
  }

  public assert(data: any) {
    const errors = this.rawAssert(data)
    const keys = Object.keys(errors)
    if (keys.length) {
      throw new InvalidValueError(keys.reduce((carry, key) => ([
        ...carry,
        ...errors[key].map(([reason, params]) => ({
          path: key,
          reason,
          params,
          message: getMessage(this.messages, key, reason, params),
        })),
      ]), [] as InvalidValueErrorReason[]))
    }
  }
}

import { InvalidValueError } from "../errors/invalid-value-error"
import { generateAssert, generateValidate } from "../generator/generate"
import { Rule, TesterMap } from "../interfaces/common"
import { InvalidValueErrorReason } from "../interfaces/error"
import { parse } from "../parser/parse"


export class Validator {

  public validate: (data: any) => boolean

  public assertInner: (data: any) => {[path: string]: string[]}

  constructor(public rule: Rule, testers: TesterMap) {
    this.validate = generateValidate(parse(rule), testers)
    this.assertInner = generateAssert(parse(rule), testers)
  }

  public assert(data: any) {
    const errors = this.assertInner(data)
    const keys = Object.keys(errors)
    if (keys.length) {
      throw new InvalidValueError(keys.reduce((carry, key) => ([
        ...carry,
        ...errors[key].map((reason) => ({
          path: key,
          reason,
          message: "",
        })),
      ]), [] as InvalidValueErrorReason[]))
    }
  }
}

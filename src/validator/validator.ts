import { MessageMap, TesterMap } from "../interfaces/common"
import { SflTester } from "../interfaces/sfl"
import { createAssert } from "../sfl/create-assert"
import { createValidate } from "../sfl/create-validate"

export class Validator {

  public validate: <P = any>(data: any) => data is P
  public assert: (data: any) => void
  // public sanitize: (data: any) => any

  constructor(
      public ast: SflTester,
      public testers: TesterMap,
      public messages: MessageMap) {
    this.validate = createValidate(ast, testers) as any
    this.assert = createAssert(ast, testers, messages)
  }
}

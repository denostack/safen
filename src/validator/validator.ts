import { MessageMap, TesterMap } from "../interfaces/common"
import { SflTester } from "../interfaces/sfl"
import { createAssert } from "../sfl/create-assert"
import { createValidate } from "../sfl/create-validate"

export class Validator<P = any> {

  public validate: (data: any) => data is P
  public assert: (data: any) => P
  // public sanitize: (data: any) => any

  public constructor(
    public ast: SflTester,
    public testers: TesterMap,
    public messages: MessageMap
  ) {
    this.validate = createValidate(ast, testers) as any
    this.assert = createAssert(ast, testers, messages)
  }
}

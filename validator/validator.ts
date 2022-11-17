import { MessageMap, TesterMap } from "../interfaces/common.ts";
import { SflTester } from "../interfaces/sfl.ts";
import { createAssert } from "../sfl/create-assert.ts";
import { createValidate } from "../sfl/create-validate.ts";

export class Validator<T = any> {
  public validate: (data: any) => data is T;
  public assert: (data: any) => T;
  // public sanitize: (data: any) => any

  public constructor(
    public ast: SflTester,
    public testers: TesterMap,
    public messages: MessageMap,
  ) {
    this.validate = createValidate(ast, testers) as any;
    this.assert = createAssert(ast, testers, messages);
  }
}

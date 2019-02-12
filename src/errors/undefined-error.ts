import { SflTester } from "../interfaces/sfl"


export class UndefinedError extends Error {

  public readonly code = "UNDEFINED_ERROR"

  constructor(message: string, public tester: SflTester) {
    super(message)
    Object.setPrototypeOf(this, UndefinedError.prototype)
  }
}

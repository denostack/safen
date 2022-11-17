import { SflTester } from "../interfaces/sfl.ts";

export class UndefinedError extends Error {
  public readonly code = "UNDEFINED_ERROR";

  public constructor(message: string, public tester: SflTester) {
    super(message);
    this.name = "UndefinedError";
    Object.setPrototypeOf(this, UndefinedError.prototype);
  }
}

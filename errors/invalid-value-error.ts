import { InvalidValueErrorReason } from "../interfaces/error.ts";

export class InvalidValueError extends Error {
  public constructor(public errors: InvalidValueErrorReason[]) {
    super("invalid value");
    this.name = "InvalidValueError";
    Object.setPrototypeOf(this, InvalidValueError.prototype);
  }

  public reasons(): string[] {
    return this.errors.map(({ reason, path }) =>
      path ? `${reason}@${path}` : reason
    );
  }

  public messages(): string[] {
    return this.errors.map(({ message }) => message);
  }
}

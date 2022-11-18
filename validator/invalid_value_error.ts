export class InvalidValueError extends Error {
  constructor(
    message: string,
    public reason: string,
    public path: string,
  ) {
    super(message);
    this.name = "InvalidValueError";
  }
}

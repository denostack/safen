
export class InvalidKeyError extends Error {
  constructor(message: string, public source: string, public correction?: string) {
    super(message)
  }
}

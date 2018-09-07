
import { ValidatingError } from "../interfaces/error"
import { MessageLoader } from "../interfaces/tester"

export class InvalidValueError extends Error {
  private listOfReasons: string[]
  private messageLoader: MessageLoader

  constructor(reasons: string[], messageLoader: MessageLoader) {
    super()
    this.listOfReasons = reasons
    this.messageLoader = messageLoader
  }

  /**
   * @deprecated use reasons()
   */
  public getErrors(): string[] {
    return this.listOfReasons
  }

  public errors(): ValidatingError[] {
    const self = this
    return this.reasons().map((reason) => {
      return {
        reason,
        message: self.messageLoader.load(reason),
      }
    })
  }

  public reasons(): string[] {
    return this.listOfReasons
  }

  public messages(): string[] {
    return this.listOfReasons.map(reason => this.messageLoader.load(reason))
  }
}

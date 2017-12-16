
import * as types from "./types"

export class InvalidValueError extends Error {
  private listOfReasons: string[]
  private messageLoader: types.MessageLoader

  constructor(reasons: string[], messageLoader: types.MessageLoader) {
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

  public errors(): types.ValidatingErrors {
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

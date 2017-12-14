
import * as types from "../types"

export class ErrorThrower implements types.ErrorThowable {
  public throws(type: string, keys: string[]): void {
    throw new Error()
  }
}

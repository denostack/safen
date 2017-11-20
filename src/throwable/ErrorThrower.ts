
import * as types from "../types"

export default class ErrorThower implements types.ErrorThowable {
  public throws(type: string, keys: string[]): void {
    throw new Error()
  }
}

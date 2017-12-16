
import * as types from "../types"

export class ErrorBag implements types.ErrorThowable {

  private errors: Array<[string, string[]]> = []

  public throws(tester: string, keys: string[]): void {
    this.errors.push([tester, keys.slice()])
  }

  public getErrors(): types.ValidatingErrors {
    return this.errors.map(([tester, keys]) => {
      const target = keys.reduce((carry: string, key: string): string => {
        if (!carry) {
          return key
        }
        if ((+key) + "" === key + "") {
          return `${carry}[${key}]`
        }
        return `${carry}.${key}`
      }, "")
      return tester + (target ? `@${target}` : "")
    })
  }
}

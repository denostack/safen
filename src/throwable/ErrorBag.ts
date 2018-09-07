
import { ErrorThowable } from "../interfaces/tester"

export class ErrorBag implements ErrorThowable {

  private errors: Array<[string, string[]]> = []

  public throws(tester: string, keys: string[]): void {
    this.errors.push([tester, keys.slice()])
  }

  public getErrors(): string[] {
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

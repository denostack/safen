
import * as types from "../types"

export class AlwaysTrueTester implements types.Tester {
  public test(data: any, origin?: any, keys?: string[]): boolean {
    return true
  }
}


import * as types from "../types"

export class AlwaysFalseTester implements types.Tester {
  public test(data: any, origin?: any, keys?: string[]): boolean {
    return false
  }
}

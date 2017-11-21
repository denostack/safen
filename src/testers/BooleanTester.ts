
import * as types from "../types"

export default class BooleanTester implements types.Tester {
  public test(data: any, origin?: any, keys?: string[]): boolean {
    return data === true || data === false
  }
}

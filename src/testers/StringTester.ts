
import * as types from "../types"
import * as _ from "lodash"

export default class StringTester implements types.Tester {
  public test(data: any, origin?: any, keys?: string[]): boolean {
    return _.isString(data)
  }
}

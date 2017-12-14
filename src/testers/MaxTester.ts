
import * as types from "../types"
import * as _ from "lodash"

export class MaxTester implements types.Tester {

  private max: string

  constructor(max: string) {
    this.max = max
  }

  public test(data: any): boolean {
    if (_.isNumber(data)) {
      return data <= +this.max
    }
    return data <= this.max
  }
}

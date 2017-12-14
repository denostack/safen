
import * as types from "../types"
import * as _ from "lodash"

export class MinTester implements types.Tester {

  private min: string

  constructor(min: string) {
    this.min = min
  }

  public test(data: any): boolean {
    if (_.isNumber(data)) {
      return data >= +this.min
    }
    return data >= this.min
  }
}

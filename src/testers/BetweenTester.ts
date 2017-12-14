
import * as types from "../types"
import * as _ from "lodash"

export class BetweenTester implements types.Tester {

  private min: string
  private max: string

  constructor(min: string, max: string) {
    this.min = min
    this.max = max
  }

  public test(data: any): boolean {
    if (_.isNumber(data)) {
      return data >= +this.min && data <= +this.max
    }
    return data >= this.min && data <= this.max
  }
}


import * as _ from "lodash"
import { Tester } from "../interfaces/tester"

export class MaxTester implements Tester {

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

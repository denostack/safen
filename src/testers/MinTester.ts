
import * as _ from "lodash"
import { Tester } from "../interfaces/tester"

export class MinTester implements Tester {

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

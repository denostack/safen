
import * as types from "../types"

export default class BetweenTester implements types.Tester {

  private min: string
  private max: string

  constructor(min: string, max: string) {
    this.min = min
    this.max = max
  }

  public test(data: any): boolean {
    return data >= this.min && data <= this.max
  }
}


import * as types from "../types"

export class LengthMinTester implements types.Tester {

  private min: number

  constructor(min: string) {
    this.min = +min
  }

  public test(data: any): boolean {
    if (!data.length) {
      return false
    }
    return data.length >= this.min
  }
}

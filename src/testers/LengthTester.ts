
import * as types from "../types"

export class LengthTester implements types.Tester {

  private len: number

  constructor(len: string) {
    this.len = +len
  }

  public test(data: any): boolean {
    if (!data.length) {
      return false
    }
    return data.length === this.len
  }
}

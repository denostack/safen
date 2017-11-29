
import * as types from "../types"

export default class LengthMaxTexter implements types.Tester {

  private max: number

  constructor(max: string) {
    this.max = +max
  }

  public test(data: any): boolean {
    if (!data.length) {
      return false
    }
    return data.length <= this.max
  }
}

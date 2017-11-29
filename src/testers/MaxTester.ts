
import * as types from "../types"

export default class MaxTexter implements types.Tester {

  private max: number

  constructor(max: string) {
    this.max = +max
  }

  public test(data: any): boolean {
    return data <= this.max
  }
}

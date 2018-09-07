
import { Tester } from "../interfaces/tester"

export class LengthMaxTester implements Tester {

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

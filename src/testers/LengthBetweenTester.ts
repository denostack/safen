
import { Tester } from "../interfaces/tester"

export class LengthBetweenTester implements Tester {

  private min: number
  private max: number

  constructor(min: string, max: string) {
    this.min = +min
    this.max = +max
  }

  public test(data: any): boolean {
    if (!data.length) {
      return false
    }
    return data.length >= this.min && data.length <= this.max
  }
}

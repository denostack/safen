
import { Tester } from "../interfaces/tester"

export class AlwaysTrueTester implements Tester {
  public test(data: any): boolean {
    return true
  }
}

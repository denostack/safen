
import { Tester } from "../interfaces/tester"

export class AlwaysFalseTester implements Tester {
  public test(data: any): boolean {
    return false
  }
}

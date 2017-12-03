
import * as types from "../types"

export default class InTester implements types.Tester {

  private args: Array<string|number>

  constructor(...args: string[]) {
    this.args = (args as Array<string|number>).concat(args.filter(arg => (+arg) + "" === arg).map(arg => +arg))
  }

  public test(data: any): boolean {
    return this.args.indexOf(data) > -1
  }
}

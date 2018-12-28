import { Tester } from "../interfaces/common"


export const symbolTester: Tester = {
  template(value: string) {
    return `(typeof (${value}) === "symbol")`
  },
}

import { Tester } from "../interfaces/common"


export const symbolTester: Tester = {
  template(value) {
    return `(typeof (${value}) === "symbol")`
  },
}

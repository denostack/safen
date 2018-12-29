import { Tester } from "../interfaces/common"


export const numberTester: Tester = {
  template(value) {
    return `(typeof (${value}) === "number")`
  },
}

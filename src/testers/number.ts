import { Tester } from "../interfaces/common"


export const numberTester: Tester = {
  template(value: string) {
    return `(typeof (${value}) === "number")`
  },
}

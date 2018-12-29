import { Tester } from "../interfaces/common"


export const stringTester: Tester = {
  template(value) {
    return `(typeof (${value}) === "string")`
  },
}

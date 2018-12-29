import { Tester } from "../interfaces/common"


export const booleanTester: Tester = {
  template(value) {
    return `(typeof (${value}) === "boolean")`
  },
}

import { Tester } from "../interfaces/common"


export const booleanTester: Tester = {
  template(value: string) {
    return `(typeof (${value}) === "boolean")`
  },
}

import { Tester } from "../interfaces/common"


export const stringTester: Tester = {
  template(value: string) {
    return `(typeof (${value}) === "string")`
  },
}

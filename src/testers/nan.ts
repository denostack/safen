import { Tester } from "../interfaces/common"


export const nanTester: Tester = {
  template(value) {
    return `(typeof (${value}) === "number" && Number.isNaN(${value}))`
  },
}

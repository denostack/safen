import { Tester } from "../interfaces/common"


export const nanTester: Tester = {
  template(value: string) {
    return `(typeof (${value}) === "number" && Number.isNaN(${value}))`
  },
}

import { Tester } from "../interfaces/common"


export const finiteTester: Tester = {
  template(value) {
    return `(typeof (${value}) === "number" && Number.isFinite(${value}))`
  },
}

import { Tester } from "../interfaces/common"


export const finiteTester: Tester = {
  template(value: string) {
    return `(typeof (${value}) === "number" && Number.isFinite(${value}))`
  },
}

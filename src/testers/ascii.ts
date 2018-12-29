import { Tester } from "../interfaces/common"


export const asciiTester: Tester = {
  template(value) {
    return `/^[\\x00-\\x7F]+$/.test(${value})`
  },
}

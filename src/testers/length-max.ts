import { Tester } from "../interfaces/common"


export const lengthMaxTester: Tester = {
  template(value, params) {
    return `(${value}.length && ${value}.length <= ${params[0]})`
  },
}

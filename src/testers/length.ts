import { Tester } from "../interfaces/common"


export const lengthTester: Tester = {
  template(value, params) {
    return `(${value}.length === ${params[0]})`
  },
}

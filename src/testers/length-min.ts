import { Tester } from "../interfaces/common"


export const lengthMinTester: Tester = {
  template(value, params) {
    return `(${value}.length && ${value}.length >= ${params[0]})`
  },
}

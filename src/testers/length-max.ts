import { Tester } from "../interfaces/common"


export const lengthMaxTester: Tester = {
  template(value: string, params: string[]) {
    return `(${value}.length && ${value}.length <= ${params[0]})`
  },
}

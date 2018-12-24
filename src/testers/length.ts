import { Tester } from "../interfaces/common"


export const lengthTester: Tester = {
  template(value: string, params: string[]) {
    return `(${value}.length === ${params[0]})`
  },
}

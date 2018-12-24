import { Tester } from "../interfaces/common"


export const lengthMinTester: Tester = {
  template(value: string, params: string[]) {
    return `(${value}.length && ${value}.length >= ${params[0]})`
  },
}

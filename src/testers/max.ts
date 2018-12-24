import { Tester } from "../interfaces/common"


export const maxTester: Tester = {
  template(value: string, params: string[]) {
    return `(${value} <= ${params[0]})`
  },
}

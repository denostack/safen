import { Tester } from "../interfaces/common"


export const minTester: Tester = {
  template(value: string, params: string[]) {
    return `(${value} >= ${params[0]})`
  },
}

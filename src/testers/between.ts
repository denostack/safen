import { Tester } from "../interfaces/common"


export const betweenTester: Tester = {
  template(value: string, params: string[]) {
    return `(${value} >= ${params[0]} && ${value} <= ${params[1]})`
  },
}

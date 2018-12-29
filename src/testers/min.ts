import { Tester } from "../interfaces/common"


export const minTester: Tester = {
  template(value, params) {
    return `(${value} >= ${JSON.stringify(params[0])})`
  },
}

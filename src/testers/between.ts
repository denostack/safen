import { Tester } from "../interfaces/common"


export const betweenTester: Tester = {
  template(value, params) {
    return `(${value} >= ${JSON.stringify(params[0])} && ${value} <= ${JSON.stringify(params[1])})`
  },
}

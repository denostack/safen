import { Tester } from "../interfaces/common"


export const maxTester: Tester = {
  template(value, params) {
    return `(${value} <= ${JSON.stringify(params[0])})`
  },
}

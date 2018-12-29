import { Tester } from "../interfaces/common"


export const inTester: Tester = {
  template(value, params) {
    return `${JSON.stringify(params)}.indexOf(${value}) > -1`
  },
}

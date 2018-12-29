import { Tester } from "../interfaces/common"


export const intTester: Tester = {
  template(value) {
    return `Number.isInteger(${value})`
  },
}

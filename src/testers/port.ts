import { Tester } from "../interfaces/common"


export const portTester: Tester = {
  template(value) {
    return `(Number.isInteger(${value}) && ${value} >= 0 && ${value} <= 65535)`
  },
}

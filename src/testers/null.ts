import { Tester } from "../interfaces/common"


export const nullTester: Tester = {
  template(value) {
    return `${value} === null`
  },
}

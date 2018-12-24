import { Tester } from "../interfaces/common"


export const nullTester: Tester = {
  template(value: string) {
    return `${value} === null`
  },
}

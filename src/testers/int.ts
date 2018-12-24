import { Tester } from "../interfaces/common"


export const intTester: Tester = {
  template(value: string) {
    return `Number.isInteger(${value})`
  },
}

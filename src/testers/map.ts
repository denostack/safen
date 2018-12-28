import { Tester } from "../interfaces/common"


export const mapTester: Tester = {
  template(value: string) {
    return `(${value} instanceof Map)`
  },
}

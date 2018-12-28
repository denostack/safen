import { Tester } from "../interfaces/common"


export const setTester: Tester = {
  template(value: string) {
    return `(${value} instanceof Set)`
  },
}

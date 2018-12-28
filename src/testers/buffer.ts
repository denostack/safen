import { Tester } from "../interfaces/common"


export const bufferTester: Tester = {
  template(value: string) {
    return `(${value} instanceof Buffer)`
  },
}

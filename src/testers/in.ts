import { Tester } from "../interfaces/common"


export const inTester: Tester = {
  template(value: string, params: string[]) {
    return `[${params.join(", ")}].indexOf(${value}) > -1`
  },
}

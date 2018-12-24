import { Tester } from "../interfaces/common"


export const alwaysTrueTester: Tester = {
  template(value: string) {
    return `true`
  },
}

import { Tester } from "../interfaces/common"


export const alwaysFalseTester: Tester = {
  template(value: string) {
    return `false`
  },
}

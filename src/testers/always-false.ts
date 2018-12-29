import { Tester } from "../interfaces/common"


export const alwaysFalseTester: Tester = {
  template(value) {
    return `false`
  },
}

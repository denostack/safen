import { Tester } from "../interfaces/common"


export const alphanumTester: Tester = {
  template(value) {
    return `/^[a-z0-9]+$/i.test(${value})`
  },
}

import { Tester } from "../interfaces/common"


export const alphaTester: Tester = {
  template(value) {
    return `/^[a-z]+$/i.test(${value})`
  },
}

import { Tester } from "../interfaces/common"


export const uppercaseTester: Tester = {
  template(value) {
    return `${value}.toUpperCase() === ${value}`
  },
}

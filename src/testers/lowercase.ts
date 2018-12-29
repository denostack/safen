import { Tester } from "../interfaces/common"


export const lowercaseTester: Tester = {
  template(value) {
    return `${value}.toLowerCase() === ${value}`
  },
}

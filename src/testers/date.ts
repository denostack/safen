import { Tester } from "../interfaces/common"


export const dateTester: Tester = {
  template(value) {
    return `!Number.isNaN(Date.parse(${value}))`
  },
}

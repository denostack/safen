import { Tester } from "../interfaces/common"


export const hexcolorTester: Tester = {
  template(value) {
    return `/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(${value})`
  },
}

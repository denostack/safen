import { Tester } from "../interfaces/common"
import { RE_IP_V4, RE_IP_V6 } from "../regexp"


export const ipTester: Tester = {
  template(value, params) {
    const version = params[0] || "all"
    switch (version) {
      case "v4":
        return `${RE_IP_V4}.test(${value})`
      case "v6":
        return `${RE_IP_V6}.test(${value})`
    }
    return `(${RE_IP_V4}.test(${value}) || ${RE_IP_V6}.test(${value}))`
  },
}

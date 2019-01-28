import { RE_IP_V4, RE_IP_V6 } from "../constants/regexp"
import { Tester } from "../interfaces/common"


export const ipTester: Tester = (value, params) => {
  const version = params[0] || "all"
  switch (version) {
    case "v4":
      return `${RE_IP_V4}.test(${value})`
    case "v6":
      return `${RE_IP_V6}.test(${value})`
  }
  return `(${RE_IP_V4}.test(${value})||${RE_IP_V6}.test(${value}))`
}

import { Tester } from "../interfaces/common"

export const regexpTester: Tester = (value, params) => `${params[0]}.test(${value})`

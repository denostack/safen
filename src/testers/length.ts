import { Tester } from "../interfaces/common"

export const lengthTester: Tester = (value, params) => `(${value}.length===${params[0]})`

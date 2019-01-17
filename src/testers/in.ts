import { Tester } from "../interfaces/common"

export const inTester: Tester = (value, params) => `${JSON.stringify(params)}.indexOf(${value})>-1`

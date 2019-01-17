import { Tester } from "../interfaces/common"

export const maxTester: Tester = (value, params) => `(${value}<=${JSON.stringify(params[0])})`

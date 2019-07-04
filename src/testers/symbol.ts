import { Tester } from '../interfaces/common'

export const symbolTester: Tester = (value) => `(typeof(${value})==="symbol")`

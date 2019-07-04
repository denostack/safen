import { Tester } from '../interfaces/common'

export const numberTester: Tester = (value) => `(typeof(${value})==="number")`

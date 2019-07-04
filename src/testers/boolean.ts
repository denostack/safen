import { Tester } from '../interfaces/common'

export const booleanTester: Tester = (value) => `(typeof(${value})==="boolean")`

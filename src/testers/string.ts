import { Tester } from '../interfaces/common'

export const stringTester: Tester = (value) => `(typeof(${value})==="string")`

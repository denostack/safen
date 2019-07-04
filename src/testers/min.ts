import { Tester } from '../interfaces/common'

export const minTester: Tester = (value, params) => `(${value}>=${JSON.stringify(params[0])})`

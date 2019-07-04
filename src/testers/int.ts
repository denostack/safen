import { Tester } from '../interfaces/common'

export const intTester: Tester = (value) => `Number.isInteger(${value})`

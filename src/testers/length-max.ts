import { Tester } from '../interfaces/common'

export const lengthMaxTester: Tester = (value, params) => `(${value}.length&&${value}.length<=${params[0]})`

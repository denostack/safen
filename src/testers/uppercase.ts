import { Tester } from '../interfaces/common'

export const uppercaseTester: Tester = (value) => `(${value}.toUpperCase&&${value}.toUpperCase()===${value})`

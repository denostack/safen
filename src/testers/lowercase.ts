import { Tester } from '../interfaces/common'

export const lowercaseTester: Tester = (value) => `(${value}.toLowerCase&&${value}.toLowerCase()===${value})`

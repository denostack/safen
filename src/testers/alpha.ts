import { Tester } from '../interfaces/common'

export const alphaTester: Tester = (value) => `/^[a-z]+$/i.test(${value})`

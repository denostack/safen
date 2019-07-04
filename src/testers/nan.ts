import { Tester } from '../interfaces/common'

export const nanTester: Tester = (value) => `(typeof(${value})==="number"&&Number.isNaN(${value}))`

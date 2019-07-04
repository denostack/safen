import { Tester } from '../interfaces/common'

export const finiteTester: Tester = (value) => `(typeof(${value})==="number"&&Number.isFinite(${value}))`

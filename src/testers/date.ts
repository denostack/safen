import { Tester } from '../interfaces/common'

export const dateTester: Tester = (value) => `!Number.isNaN(Date.parse(${value}))`

import { Tester } from "../interfaces/common"

export const alphanumTester: Tester = (value) => `/^[a-z0-9]+$/i.test(${value})`

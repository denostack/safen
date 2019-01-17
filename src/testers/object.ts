import { Tester } from "../interfaces/common"

export const objectTester: Tester = (value) => `(${value}!==null&&typeof(${value})==="object")`

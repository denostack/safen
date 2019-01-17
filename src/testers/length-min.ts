import { Tester } from "../interfaces/common"

export const lengthMinTester: Tester = (value, params) => `(${value}.length&&${value}.length>=${params[0]})`

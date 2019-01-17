import { Tester } from "../interfaces/common"

export const portTester: Tester = (value) => `(Number.isInteger(${value})&&${value}>=0&&${value}<=65535)`

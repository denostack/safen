import { Tester } from "../interfaces/common.ts";

export const symbolTester: Tester = (value) => `(typeof(${value})==="symbol")`;

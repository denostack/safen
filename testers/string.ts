import { Tester } from "../interfaces/common.ts";

export const stringTester: Tester = (value) => `(typeof(${value})==="string")`;

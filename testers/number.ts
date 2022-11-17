import { Tester } from "../interfaces/common.ts";

export const numberTester: Tester = (value) => `(typeof(${value})==="number")`;

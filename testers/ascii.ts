import { Tester } from "../interfaces/common.ts";

export const asciiTester: Tester = (value) =>
  `/^[\\x00-\\x7F]+$/.test(${value})`;

import { Tester } from "../interfaces/common.ts";

export const regexpTester: Tester = (value, params) =>
  `${params[0]}.test(${value})`;

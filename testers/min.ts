import { Tester } from "../interfaces/common.ts";

export const minTester: Tester = (value, params) =>
  `(${value}>=${JSON.stringify(params[0])})`;

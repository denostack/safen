import { Tester } from "../interfaces/common.ts";

export const maxTester: Tester = (value, params) =>
  `(${value}<=${JSON.stringify(params[0])})`;

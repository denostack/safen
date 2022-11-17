import { Tester } from "../interfaces/common.ts";

export const nanTester: Tester = (value) =>
  `(typeof(${value})==="number"&&Number.isNaN(${value}))`;

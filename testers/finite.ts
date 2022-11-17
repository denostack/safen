import { Tester } from "../interfaces/common.ts";

export const finiteTester: Tester = (value) =>
  `(typeof(${value})==="number"&&Number.isFinite(${value}))`;

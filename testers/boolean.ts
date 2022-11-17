import { Tester } from "../interfaces/common.ts";

export const booleanTester: Tester = (value) =>
  `(typeof(${value})==="boolean")`;

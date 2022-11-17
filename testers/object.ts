import { Tester } from "../interfaces/common.ts";

export const objectTester: Tester = (value) =>
  `(${value}!==null&&typeof(${value})==="object")`;

import { Tester } from "../interfaces/common.ts";

export const lengthTester: Tester = (value, params) =>
  `(${value}.length===${params[0]})`;

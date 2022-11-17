import { Tester } from "../interfaces/common.ts";

export const lengthMinTester: Tester = (value, params) =>
  `(${value}.length&&${value}.length>=${params[0]})`;

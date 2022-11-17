import { Tester } from "../interfaces/common.ts";

export const uppercaseTester: Tester = (value) =>
  `(${value}.toUpperCase&&${value}.toUpperCase()===${value})`;

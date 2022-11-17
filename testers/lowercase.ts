import { Tester } from "../interfaces/common.ts";

export const lowercaseTester: Tester = (value) =>
  `(${value}.toLowerCase&&${value}.toLowerCase()===${value})`;

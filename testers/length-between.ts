import { Tester } from "../interfaces/common.ts";

export const lengthBetweenTester: Tester = (value, params) =>
  `(${value}.length&&${value}.length>=${params[0]}&&${value}.length<=${
    params[1]
  })`;

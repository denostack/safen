import { Tester } from "../interfaces/common.ts";

export const macaddressTester: Tester = (value) =>
  `/^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/.test(${value})`;

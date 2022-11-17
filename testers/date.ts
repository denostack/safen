import { Tester } from "../interfaces/common.ts";

export const dateTester: Tester = (value) =>
  `!Number.isNaN(Date.parse(${value}))`;

import { Tester } from "../interfaces/common.ts";

export const hexcolorTester: Tester = (value) =>
  `/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(${value})`;

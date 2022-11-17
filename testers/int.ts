import { Tester } from "../interfaces/common.ts";

export const intTester: Tester = (value) => `Number.isInteger(${value})`;

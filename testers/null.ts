import { Tester } from "../interfaces/common.ts";

export const nullTester: Tester = (value) => `${value}===null`;

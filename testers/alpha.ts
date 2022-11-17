import { Tester } from "../interfaces/common.ts";

export const alphaTester: Tester = (value) => `/^[a-z]+$/i.test(${value})`;

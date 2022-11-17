import { Tester } from "../interfaces/common.ts";

// ref. https://github.com/chriso/validator.js/blob/master/src/lib/isJWT.js
export const jwtTester: Tester = (value) =>
  `/^([A-Za-z0-9\\-_~+\\/]+[=]{0,2})\\.([A-Za-z0-9\\-_~+\\/]+[=]{0,2})(?:\\.([A-Za-z0-9\\-_~+\\/]+[=]{0,2}))?$/.test(${value})`;

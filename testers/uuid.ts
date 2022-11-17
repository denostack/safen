import {
  RE_UUID,
  RE_UUID_V3,
  RE_UUID_V4,
  RE_UUID_V5,
} from "../constants/regexp.ts";
import { Tester } from "../interfaces/common.ts";

// ref. https://github.com/chriso/validator.js/blob/master/src/lib/isUUID.js
export const uuidTester: Tester = (value, params) => {
  const version = params[0] || "all";
  switch (version) {
    case "v3":
      return `${RE_UUID_V3}.test(${value})`;
    case "v4":
      return `${RE_UUID_V4}.test(${value})`;
    case "v5":
      return `${RE_UUID_V5}.test(${value})`;
  }
  return `${RE_UUID}.test(${value})`;
};

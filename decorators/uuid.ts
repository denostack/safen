import { Decorator } from "../decorator/decorator.ts";

export const re =
  /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
export const re3 =
  /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
export const re4 =
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
export const re5 =
  /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

// ref. https://github.com/chriso/validator.js/blob/master/src/lib/isUUID.js
export function uuid(version?: "v3" | "v4" | "v5"): Decorator<string> {
  if (version === "v3") {
    return {
      name: "uuid(v3)",
      validate(v) {
        return re3.test(v);
      },
    };
  }
  if (version === "v4") {
    return {
      name: "uuid(v4)",
      validate(v) {
        return re4.test(v);
      },
    };
  }
  if (version === "v5") {
    return {
      name: "uuid(v5)",
      validate(v) {
        return re5.test(v);
      },
    };
  }
  return {
    name: "uuid",
    validate(v) {
      return re.test(v);
    },
  };
}

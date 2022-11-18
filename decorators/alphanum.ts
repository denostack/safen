import { SafenDecorator } from "../schema/schema.ts";

export function alphanum(): SafenDecorator<string> {
  return {
    name: "alphanum",
    validate: (v) => `/^[a-z0-9]+$/i.test(${v})`,
  };
}

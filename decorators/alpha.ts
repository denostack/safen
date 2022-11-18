import { SafenDecorator } from "../schema/schema.ts";

export function alpha(): SafenDecorator<string> {
  return {
    name: "alpha",
    validate: (v) => `/^[a-z]+$/i.test(${v})`,
  };
}

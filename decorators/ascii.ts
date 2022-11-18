import { SafenDecorator } from "../schema/schema.ts";

export function ascii(): SafenDecorator<string> {
  return {
    name: "ascii",
    validate: (v) => `/^[\\x00-\\x7F]+$/.test(${v})`,
  };
}

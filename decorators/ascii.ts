import { SchemaDecorator } from "../schema/schema.ts";

export function ascii(): SchemaDecorator<string> {
  return {
    name: "ascii",
    validate: (v) => `/^[\\x00-\\x7F]+$/.test(${v})`,
  };
}

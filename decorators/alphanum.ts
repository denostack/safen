import { SchemaDecorator } from "../schema/schema.ts";

export function alphanum(): SchemaDecorator<string> {
  return {
    name: "alphanum",
    validate: (v) => `/^[a-z0-9]+$/i.test(${v})`,
  };
}

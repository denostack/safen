import { SchemaDecorator } from "../schema/schema.ts";

export function hexcolor(): SchemaDecorator<string> {
  return {
    name: "hexcolor",
    validate: (v) => `/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(${v})`,
  };
}

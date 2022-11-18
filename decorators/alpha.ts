import { SchemaDecorator } from "../schema/schema.ts";

export function alpha(): SchemaDecorator<string> {
  return {
    name: "alpha",
    validate: (v) => `/^[a-z]+$/i.test(${v})`,
  };
}

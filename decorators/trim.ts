import { SchemaDecorator } from "../schema/schema.ts";

export function trim(): SchemaDecorator<string> {
  return {
    name: "trim",
    sanitize: (v) => `${v}.trim()`,
  };
}

import { SchemaDecorator } from "../schema/schema.ts";

export function lowercase(): SchemaDecorator<string> {
  return {
    name: "lowercase",
    validate: (v) => `(${v}.toLowerCase() === ${v})`,
  };
}

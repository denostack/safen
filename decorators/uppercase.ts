import { SchemaDecorator } from "../schema/schema.ts";

export function uppercase(): SchemaDecorator<string> {
  return {
    name: "uppercase",
    validate: (v) => `(${v}.toUpperCase() === ${v})`,
  };
}

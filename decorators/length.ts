import { SchemaDecorator } from "../schema/schema.ts";

export function length(
  len: number,
): SchemaDecorator<string | unknown[]> {
  return {
    name: `length(${len})`,
    validate: (v) => `(${v}.length==${len})`,
  };
}

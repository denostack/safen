import { SchemaDecorator } from "../schema/schema.ts";

export function lengthMin(
  min: number,
): SchemaDecorator<string | unknown[]> {
  return {
    name: `lengthMin(${min})`,
    validate: (v) => `(${v}.length&&${v}.length>=${min})`,
  };
}

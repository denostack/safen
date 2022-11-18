import { SchemaDecorator } from "../schema/schema.ts";

export function lengthMax(
  max: number,
): SchemaDecorator<string | unknown[]> {
  return {
    name: `lengthMax(${max})`,
    validate: (v) => `(${v}.length&&${v}.length<=${max})`,
  };
}

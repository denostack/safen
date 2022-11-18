import { SchemaDecorator } from "../schema/schema.ts";

export function max(
  max: number | string,
): SchemaDecorator<number | string> {
  return {
    name: `max(${max})`,
    validate: (v) => `(${v}<=${JSON.stringify(max)})`,
  };
}

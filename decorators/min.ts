import { SchemaDecorator } from "../schema/schema.ts";

export function min(
  min: number | string,
): SchemaDecorator<number | string> {
  return {
    name: `min(${min})`,
    validate: (v) => `(${v}>=${JSON.stringify(min)})`,
  };
}

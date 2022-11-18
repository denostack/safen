import { SchemaDecorator } from "../schema/schema.ts";

export function between(
  min: number | string,
  max: number | string,
): SchemaDecorator<number | string> {
  return {
    name: `between(${min},${max})`,
    validate: (v) =>
      `(${v}>=${JSON.stringify(min)}&&${v}<=${JSON.stringify(max)})`,
  };
}

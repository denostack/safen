import { SchemaDecorator } from "../schema/schema.ts";

export function port(): SchemaDecorator<number> {
  return {
    name: `port`,
    validate: (v) => `(Number.isInteger(${v})&&${v}>=0&&${v}<=65535)`,
  };
}

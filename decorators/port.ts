import { SafenDecorator } from "../schema/schema.ts";

export function port(): SafenDecorator<number> {
  return {
    name: `port`,
    validate: (v) => `(Number.isInteger(${v})&&${v}>=0&&${v}<=65535)`,
  };
}

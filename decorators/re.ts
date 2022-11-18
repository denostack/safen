import { SchemaDecorator } from "../schema/schema.ts";

export function re(re: RegExp): SchemaDecorator<string> {
  return {
    name: `re(${re})`,
    validate: (v) => `${re}.test(${v})`,
  };
}

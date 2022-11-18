import { SchemaDecorator } from "../schema/schema.ts";

export function dateformat(): SchemaDecorator<string> {
  return {
    name: "dateformat",
    validate: (v) => `!Number.isNaN(Date.parse(${v}))`,
  };
}

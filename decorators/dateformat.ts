import { SafenDecorator } from "../schema/schema.ts";

export function dateformat(): SafenDecorator<string> {
  return {
    name: "dateformat",
    validate: (v) => `!Number.isNaN(Date.parse(${v}))`,
  };
}

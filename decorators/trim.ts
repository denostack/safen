import { SafenDecorator } from "../schema/schema.ts";

export function trim(): SafenDecorator<string> {
  return {
    name: "trim",
    sanitize: (v) => `${v}.trim()`,
  };
}

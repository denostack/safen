import { SafenDecorator } from "../schema/schema.ts";

export function uppercase(): SafenDecorator<string> {
  return {
    name: "uppercase",
    validate: (v) => `(${v}.toUpperCase() === ${v})`,
  };
}

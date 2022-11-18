import { SafenDecorator } from "../schema/schema.ts";

export function lowercase(): SafenDecorator<string> {
  return {
    name: "lowercase",
    validate: (v) => `(${v}.toLowerCase() === ${v})`,
  };
}

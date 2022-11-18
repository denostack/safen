import { SafenDecorator } from "../schema/schema.ts";

export function re(re: RegExp): SafenDecorator<string> {
  return {
    name: `re(${re})`,
    validate: (v) => `${re}.test(${v})`,
  };
}

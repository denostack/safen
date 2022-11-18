import { SafenDecorator } from "../schema/schema.ts";

export function max(
  max: number | string,
): SafenDecorator<number | string> {
  return {
    name: `max(${max})`,
    validate: (v) => `(${v}<=${JSON.stringify(max)})`,
  };
}

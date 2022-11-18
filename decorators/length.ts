import { SafenDecorator } from "../schema/schema.ts";

export function length(
  len: number,
): SafenDecorator<string | unknown[]> {
  return {
    name: `length(${len})`,
    validate: (v) => `(${v}.length==${len})`,
  };
}

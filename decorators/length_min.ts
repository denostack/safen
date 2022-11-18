import { SafenDecorator } from "../schema/schema.ts";

export function lengthMin(
  min: number,
): SafenDecorator<string | unknown[]> {
  return {
    name: `lengthMin(${min})`,
    validate: (v) => `(${v}.length&&${v}.length>=${min})`,
  };
}

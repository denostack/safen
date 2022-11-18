import { SafenDecorator } from "../schema/schema.ts";

export function lengthMax(
  max: number,
): SafenDecorator<string | unknown[]> {
  return {
    name: `lengthMax(${max})`,
    validate: (v) => `(${v}.length&&${v}.length<=${max})`,
  };
}

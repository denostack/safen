import { SafenDecorator } from "../schema/schema.ts";

export function lengthBetween(
  min: number,
  max: number,
): SafenDecorator<string | unknown[]> {
  return {
    name: `lengthBetween(${min},${max})`,
    validate: (v) => `(${v}.length&&${v}.length>=${min}&&${v}.length<=${max})`,
  };
}

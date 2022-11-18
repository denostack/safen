import { SafenDecorator } from "../schema/schema.ts";

export function between(
  min: number | string,
  max: number | string,
): SafenDecorator<number | string> {
  return {
    name: `between(${min},${max})`,
    validate: (v) =>
      `(${v}>=${JSON.stringify(min)}&&${v}<=${JSON.stringify(max)})`,
  };
}

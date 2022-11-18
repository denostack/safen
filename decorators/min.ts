import { SafenDecorator } from "../schema/schema.ts";

export function min(
  min: number | string,
): SafenDecorator<number | string> {
  return {
    name: `min(${min})`,
    validate: (v) => `(${v}>=${JSON.stringify(min)})`,
  };
}

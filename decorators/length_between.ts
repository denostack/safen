import { Decorator } from "../decorator/decorator.ts";

export function lengthBetween(
  min: number,
  max: number,
): Decorator<string & unknown[]> {
  return {
    name: "lengthBetween",
    validate(v) {
      return typeof v.length === "number" &&
        v.length >= min &&
        v.length <= max;
    },
  };
}

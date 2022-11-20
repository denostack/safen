import { Decorator } from "../decorator/decorator.ts";

export function lengthMin(min: number): Decorator<string & unknown[]> {
  return {
    name: "lengthMin",
    validate(v) {
      return typeof v.length === "number" &&
        v.length >= min;
    },
  };
}

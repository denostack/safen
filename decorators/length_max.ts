import { Decorator } from "../decorator/decorator.ts";

export function lengthMax(max: number): Decorator<string & unknown[]> {
  return {
    name: "lengthMax",
    validate(v) {
      return typeof v.length === "number" &&
        v.length <= max;
    },
  };
}

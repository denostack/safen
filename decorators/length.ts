import { Decorator } from "../decorator/decorator.ts";

export function length(n: number): Decorator<string & unknown[]> {
  return {
    name: "length",
    validate(v) {
      return v.length === n;
    },
  };
}

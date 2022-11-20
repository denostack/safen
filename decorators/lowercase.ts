import { Decorator } from "../decorator/decorator.ts";

export function lowercase(): Decorator<string> {
  return {
    name: "lowercase",
    validate(v) {
      return v.toLowerCase() === v;
    },
  };
}

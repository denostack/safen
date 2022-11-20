import { Decorator } from "../decorator/decorator.ts";

export function re(re: RegExp): Decorator<string> {
  return {
    name: "re",
    validate(v) {
      return re.test(v);
    },
  };
}

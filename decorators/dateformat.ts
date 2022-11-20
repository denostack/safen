import { Decorator } from "../decorator/decorator.ts";

const decorator: Decorator<string> = {
  name: "dateformat",
  validate(v) {
    return !Number.isNaN(Date.parse(v));
  },
};

export function dateformat(): Decorator<string> {
  return decorator;
}

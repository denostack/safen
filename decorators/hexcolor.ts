import { Decorator } from "../decorator/decorator.ts";

const decorator: Decorator<string> = {
  name: "hexcolor",
  validate(v) {
    return /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(v);
  },
};

export function hexcolor(): Decorator<string> {
  return decorator;
}

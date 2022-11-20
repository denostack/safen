import { Decorator } from "../decorator/decorator.ts";

const re = /^[a-z]+$/i;
const decorator: Decorator<string> = {
  name: "alpha",
  validate(v) {
    return re.test(v);
  },
};

export function alpha(): Decorator<string> {
  return decorator;
}

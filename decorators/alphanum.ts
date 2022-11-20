import { Decorator } from "../decorator/decorator.ts";

const re = /^[a-z0-9]+$/i;
const decorator: Decorator<string> = {
  name: "alphanum",
  validate(v) {
    return re.test(v);
  },
};

export function alphanum(): Decorator<string> {
  return decorator;
}

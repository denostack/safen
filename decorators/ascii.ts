import { Decorator } from "../decorator/decorator.ts";

// deno-lint-ignore no-control-regex
const re = /^[\x00-\x7F]+$/;
const decorator: Decorator<string> = {
  name: "ascii",
  validate(v) {
    return re.test(v);
  },
};

export function ascii(): Decorator<string> {
  return decorator;
}

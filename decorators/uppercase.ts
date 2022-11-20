import { Decorator } from "../decorator/decorator.ts";

const decorator: Decorator<string> = {
  name: "uppercase",
  validate(v) {
    return v.toUpperCase() === v;
  },
};
export function uppercase(): Decorator<string> {
  return decorator;
}

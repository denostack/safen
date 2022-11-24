import { Decorator } from "../decorator/decorator.ts";

const decorator: Decorator<string> = {
  name: "toUpper",
  transform(v) {
    return v.toUpperCase();
  },
};
export function toUpper(): Decorator<string> {
  return decorator;
}

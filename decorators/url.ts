import { Decorator } from "../decorator/decorator.ts";

const decorator: Decorator<string> = {
  name: "url",
  validate(v) {
    try {
      new URL(v);
      return true;
    } catch {
      return false;
    }
  },
};
export function url(): Decorator<string> {
  return decorator;
}

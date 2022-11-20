import { Decorator } from "../decorator/decorator.ts";

const decorator: Decorator<string> = {
  name: "json",
  validate(v) {
    try {
      JSON.parse(v);
      return true;
    } catch {
      return false;
    }
  },
};

export function json(): Decorator<string> {
  return decorator;
}

import { Decorator } from "../decorator/decorator.ts";

const decorator: Decorator<string> = {
  name: "toLower",
  transform(v) {
    return v.toLowerCase();
  },
};
export function toLower(): Decorator<string> {
  return decorator;
}

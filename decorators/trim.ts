import { Decorator } from "../decorator/decorator.ts";

const decorator: Decorator<string> = {
  name: "trim",
  transform: (v) => v.trim(),
};
export function trim(): Decorator<string> {
  return decorator;
}

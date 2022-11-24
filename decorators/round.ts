import { Decorator } from "../decorator/decorator.ts";

const decorator: Decorator<number> = {
  name: "round",
  transform(v) {
    return Math.round(v);
  },
};
export function round(): Decorator<number> {
  return decorator;
}

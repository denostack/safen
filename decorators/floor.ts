import { Decorator } from "../decorator/decorator.ts";

const decorator: Decorator<number> = {
  name: "floor",
  transform(v) {
    return Math.floor(v);
  },
};
export function floor(): Decorator<number> {
  return decorator;
}

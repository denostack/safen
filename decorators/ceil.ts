import { Decorator } from "../decorator/decorator.ts";

const decorator: Decorator<number> = {
  name: "ceil",
  transform(v) {
    return Math.ceil(v);
  },
};
export function ceil(): Decorator<number> {
  return decorator;
}

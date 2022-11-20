import { Decorator } from "../decorator/decorator.ts";

const decorator: Decorator<number> = {
  name: "port",
  validate(v) {
    return v >= 0 && v <= 65535;
  },
};
export function port(): Decorator<number> {
  return decorator;
}

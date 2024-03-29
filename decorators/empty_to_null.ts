import { Decorator } from "../decorator/decorator.ts";

const decorator: Decorator<string | null> = {
  name: "emptyToNull",
  transform: (v) => v ? v : null,
};
export function emptyToNull(): Decorator<string | null> {
  return decorator;
}

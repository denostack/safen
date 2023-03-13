import { Decorator } from "../decorator/decorator.ts";

const decorator: Decorator<string> = {
  name: "stringify",
  cast: (v) =>
    v == null ? "" : typeof v === "object" ? JSON.stringify(v) : `${v}`,
};

export function stringify(): Decorator<string> {
  return decorator;
}

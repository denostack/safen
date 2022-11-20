import { Decorator } from "../decorator/decorator.ts";

const decorator: Decorator<string> = {
  name: "base64",
  validate(v) {
    const l = v.length;
    if (!l || l % 4 !== 0 || /[^A-Z0-9+\\/=]/i.test(v)) return false;
    const index = v.indexOf("=");
    return index === -1 || index === l - 1 ||
      (index === l - 2 && v[l - 1] === "=");
  },
};

export function base64(): Decorator<string> {
  return decorator;
}

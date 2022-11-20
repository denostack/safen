import { Decorator } from "../decorator/decorator.ts";

const re = /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/;
const decorator: Decorator<string> = {
  name: "macaddress",
  validate(v) {
    return re.test(v);
  },
};

export function macaddress(): Decorator<string> {
  return decorator;
}

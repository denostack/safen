import { Decorator } from "../decorator/decorator.ts";

/**
 * RFC 5322
 * @ref https://emailregex.com/
 */
const re =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const decorator: Decorator<string> = {
  name: "email",
  validate(v: string) {
    return re.test(v);
  },
};

export function email(): Decorator<string> {
  return decorator;
}

import { SafenDecorator } from "../schema/schema.ts";

/**
 * RFC 5322
 * @ref https://emailregex.com/
 */
const re =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function email(): SafenDecorator<string> {
  return {
    name: "email",
    validate: (v) => `${re}.test(${v})`,
  };
}

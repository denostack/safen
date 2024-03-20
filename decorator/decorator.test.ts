import { assertEquals } from "assert/mod.ts";

import { Decorator } from "./decorator.ts";

type IsSubset<T, F> = T extends F ? true : false;

function is<T extends true>() {
  return true;
}

function isNot<T extends false>() {
  return true;
}

Deno.test("decorator/decorator, type check", () => {
  const v1 = { name: "custom" };

  assertEquals(is<IsSubset<typeof v1, Decorator<string>>>(), true);

  const v2 = () => {};
  assertEquals(isNot<IsSubset<typeof v2, Decorator<string>>>(), true);

  const v3 = "string";
  assertEquals(isNot<IsSubset<typeof v3, Decorator<string>>>(), true);
});

import { assert, assertFalse } from "testing/asserts.ts";
import { createValidate } from "./create_validate.ts";

Deno.test("validator/create_validate, createValidate string", () => {
  const v = createValidate(String);

  assert(v("string"));
  assert(v(""));

  assertFalse(v(1));
  assertFalse(v(1n));
  assertFalse(v(true));
  assertFalse(v(null));
  assertFalse(v(undefined));
});

Deno.test("validator/create_validate, createValidate number", () => {
  const v = createValidate(Number);

  assert(v(30));
  assert(v(3.5));

  assertFalse(v("string"));
  assertFalse(v(1n));
  assertFalse(v(true));
  assertFalse(v(null));
  assertFalse(v(undefined));
});

Deno.test("validator/create_validate, createValidate boolean", () => {
  const v = createValidate(Boolean);

  assert(v(true));
  assert(v(false));

  assertFalse(v("string"));
  assertFalse(v(1));
  assertFalse(v(1n));
  assertFalse(v(null));
  assertFalse(v(undefined));
});

Deno.test("validator/create_validate, createValidate bigint", () => {
  const v = createValidate(BigInt);

  assert(v(1n));

  assertFalse(v("string"));
  assertFalse(v(1));
  assertFalse(v(true));
  assertFalse(v(null));
  assertFalse(v(undefined));
});

Deno.test("validator/create_validate, createValidate null", () => {
  const v = createValidate(null);

  assert(v(null));

  assertFalse(v("string"));
  assertFalse(v(1));
  assertFalse(v(1n));
  assertFalse(v(true));
  assertFalse(v(undefined));
});

Deno.test("validator/create_validate, createValidate undefined", () => {
  const v = createValidate(undefined);

  assert(v(undefined));

  assertFalse(v("string"));
  assertFalse(v(1));
  assertFalse(v(1n));
  assertFalse(v(true));
  assertFalse(v(null));
});

Deno.test("validator/create_validate, createValidate object", () => {
  const Point = {
    x: Number,
    y: Number,
  };
  const v = createValidate({
    start: Point,
    end: Point,
  });

  assert(v({ start: { x: 1, y: 2 }, end: { x: 3, y: 4 } }));
});

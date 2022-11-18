import { assert, assertFalse } from "testing/asserts.ts";
import { ip } from "../decorators/ip.ts";
import { any, array, decorate, or } from "../schema/utils.ts";
import { createValidate } from "./create_validate.ts";

Deno.test("validator/create_validate, createValidate string", () => {
  const v = createValidate(String);

  assert(v("1"));
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

  assertFalse(v("1"));
  assertFalse(v(1n));
  assertFalse(v(true));
  assertFalse(v(null));
  assertFalse(v(undefined));
});

Deno.test("validator/create_validate, createValidate boolean", () => {
  const v = createValidate(Boolean);

  assert(v(true));
  assert(v(false));

  assertFalse(v("1"));
  assertFalse(v(1));
  assertFalse(v(1n));
  assertFalse(v(null));
  assertFalse(v(undefined));
});

Deno.test("validator/create_validate, createValidate bigint", () => {
  const v = createValidate(BigInt);

  assert(v(1n));

  assertFalse(v("1"));
  assertFalse(v(1));
  assertFalse(v(true));
  assertFalse(v(null));
  assertFalse(v(undefined));
});

Deno.test("validator/create_validate, createValidate symbol", () => {
  const v = createValidate(Symbol);

  assert(v(Symbol(1)));

  assertFalse(v("1"));
  assertFalse(v(1));
  assertFalse(v(true));
  assertFalse(v(null));
  assertFalse(v(undefined));
});

Deno.test("validator/create_validate, createValidate string value", () => {
  const v = createValidate("something");

  assert(v("something"));
  assertFalse(v("unknown"));
});

Deno.test("validator/create_validate, createValidate number value", () => {
  const v = createValidate(1);

  assert(v(1));
  assertFalse(v(0));
});

Deno.test("validator/create_validate, createValidate boolean value", () => {
  {
    const v = createValidate(true);

    assert(v(true));
    assertFalse(v(false));
  }
  {
    const v = createValidate(false);

    assert(v(false));
    assertFalse(v(true));
  }
});

Deno.test("validator/create_validate, createValidate bigint value", () => {
  const v = createValidate(1n);

  assert(v(1n));
  assertFalse(v(0n));
});

Deno.test("validator/create_validate, createValidate null", () => {
  const v = createValidate(null);

  assert(v(null));

  assertFalse(v("1"));
  assertFalse(v(1));
  assertFalse(v(1n));
  assertFalse(v(true));
  assertFalse(v(undefined));
});

Deno.test("validator/create_validate, createValidate undefined", () => {
  const v = createValidate(undefined);

  assert(v(undefined));

  assertFalse(v("1"));
  assertFalse(v(1));
  assertFalse(v(1n));
  assertFalse(v(true));
  assertFalse(v(null));
});

Deno.test("validator/create_validate, createValidate any", () => {
  const v = createValidate(any());

  assert(v(undefined));
  assert(v("1"));
  assert(v(1));
  assert(v(1n));
  assert(v(true));
  assert(v(null));
});

Deno.test("validator/create_validate, createValidate object", () => {
  const Point = {
    x: Number,
    y: Number,
  };
  const v = createValidate({
    start: Point,
    end: Point,
    empty: {},
  });

  assert(v({ start: { x: 1, y: 2 }, end: { x: 3, y: 4 }, empty: {} }));
});

Deno.test("validator/create_validate, createValidate or", () => {
  const v = createValidate(or([String, Number, BigInt]));

  assert(v("1"));
  assert(v(1));
  assert(v(1n));

  assertFalse(v(true));
  assertFalse(v(null));
  assertFalse(v(undefined));
});

Deno.test("validator/create_validate, createValidate array of any", () => {
  const v = createValidate(Array);

  assert(v([]));
  assert(v(["1", 1, 1n]));

  assert(v(["1"]));
  assert(v([1]));
  assert(v([1n]));
  assert(v([true]));
  assert(v([null]));
  assert(v([undefined]));

  assertFalse(v(1));
  assertFalse(v(1n));
  assertFalse(v(true));
  assertFalse(v(null));
  assertFalse(v(undefined));
});

Deno.test("validator/create_validate, createValidate array", () => {
  const v = createValidate(array(or([String, Number, BigInt])));

  assert(v([]));
  assert(v(["1", 1, 1n]));

  assert(v(["1"]));
  assert(v([1]));
  assert(v([1n]));
  assertFalse(v([true]));
  assertFalse(v([null]));
  assertFalse(v([undefined]));

  assertFalse(v(1));
  assertFalse(v(1n));
  assertFalse(v(true));
  assertFalse(v(null));
  assertFalse(v(undefined));
});

Deno.test("validator/create_validate, createValidate array", () => {
  const v = createValidate(array(or([String, Number, BigInt])));

  assert(v([]));
  assert(v(["1", 1, 1n]));

  assert(v(["1"]));
  assert(v([1]));
  assert(v([1n]));
  assertFalse(v([true]));
  assertFalse(v([null]));
  assertFalse(v([undefined]));

  assertFalse(v(1));
  assertFalse(v(1n));
  assertFalse(v(true));
  assertFalse(v(null));
  assertFalse(v(undefined));
});

Deno.test("validator/create_validate, createValidate decorate", () => {
  const v = createValidate(decorate(String, ip("v4")));

  assert(v("127.0.0.1"));
  assertFalse(v("1"));
});

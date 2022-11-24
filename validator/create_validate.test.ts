import { between } from "../decorators/between.ts";
import { email } from "../decorators/email.ts";
import { lengthBetween } from "../decorators/length_between.ts";
import { assert, assertFalse } from "testing/asserts.ts";
import { any, array, decorate, optional, or, union } from "../ast/utils.ts";
import { emptyToNull } from "../decorators/emptyToNull.ts";
import { ip } from "../decorators/ip.ts";
import { trim } from "../decorators/trim.ts";
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

Deno.test("validator/create_validate, createValidate string literal", () => {
  const v = createValidate("something");

  assert(v("something"));
  assertFalse(v("unknown"));
});

Deno.test("validator/create_validate, createValidate number literal", () => {
  const v = createValidate(1);

  assert(v(1));
  assertFalse(v(0));
});

Deno.test("validator/create_validate, createValidate boolean literal", () => {
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

Deno.test("validator/create_validate, createValidate bigint literal", () => {
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

Deno.test("validator/create_validate, createValidate union", () => {
  const v = createValidate(union([String, Number, BigInt]));

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
  const v = createValidate([or([String, Number, BigInt])]);

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

Deno.test("validator/create_validate, createValidate array by util", () => {
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

Deno.test("validator/create_validate, createValidate decorate complex", () => {
  const v = createValidate(
    decorate(
      union([decorate(String, trim()), null]),
      emptyToNull(),
    ),
  );

  assert(v("  127.0.0.1  "));
  assert(v("    "));
  assert(v(null));
});

Deno.test("validator/create_validate, createValidate complex", () => {
  const typeLat = decorate(Number, between(-90, 90));
  const typeLng = decorate(Number, between(-180, 180));
  const v = createValidate({
    id: Number,
    email: decorate(String, [trim(), email()]),
    name: optional(String),
    password: decorate(String, lengthBetween(8, 20)),
    areas: [{
      lat: typeLat,
      lng: typeLng,
    }],
    env: {
      ip: decorate(String, ip("v4")),
      os: {
        name: or([
          "window" as const,
          "osx" as const,
          "android" as const,
          "iphone" as const,
        ]),
        version: String,
      },
      browser: {
        name: or([
          "chrome" as const,
          "firefox" as const,
          "edge" as const,
          "ie" as const,
        ]),
        version: String,
      },
    },
  });

  assert(
    v({
      id: 30,
      email: "       wan2land@gmail.com     ",
      name: "wan2land",
      password: "12345678",
      areas: [
        { lat: 0, lng: 0 },
      ],
      env: {
        ip: "127.0.0.1",
        os: {
          name: "osx",
          version: "10.13.1",
        },
        browser: {
          name: "chrome",
          version: "62.0.3202.94",
        },
      },
    }),
  );
});

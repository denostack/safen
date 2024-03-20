import { assert, assertFalse } from "assert/mod.ts";
import { v } from "./short.ts";

Deno.test("short, validation, decorate", () => {
  const validate = v({
    decorate: v.decorate(String, (d) => [d.email()]),
  });

  assert(validate({
    decorate: "wan2land@gmail.com",
  }));
  assertFalse(validate({
    decorate: "wan2land",
  }));
});

Deno.test("short, validation, union", () => {
  const validate = v({
    union: v.union([String, Number]),
  });

  assert(validate({
    union: "string",
  }));
  assert(validate({
    union: 30,
  }));
  assertFalse(validate({
    union: false,
  }));
});

Deno.test("short, validation, array", () => {
  const validate = v({
    array: v.array(String),
  });

  assert(validate({
    array: ["string"],
  }));
  assertFalse(validate({
    array: {},
  }));
});

Deno.test("short, validation, any", () => {
  const validate = v({
    any: v.any(),
  });

  assert(validate({
    any: "string",
  }));
  assert(validate({
    any: null,
  }));
  assert(validate({
    any: undefined,
  }));
  assert(validate({}));
});

Deno.test("short, validation, optional", () => {
  const validate = v({
    optional: v.optional(String),
  });

  assert(validate({
    optional: "string",
  }));
  assert(validate({
    optional: undefined,
  }));
  assert(validate({}));

  assertFalse(validate({
    optional: 30,
  }));
});

import { assertEquals, assertThrows } from "testing/asserts.ts";
import { between } from "../decorators/between.ts";
import { email } from "../decorators/email.ts";
import { ip } from "../decorators/ip.ts";
import { lengthBetween } from "../decorators/length_between.ts";
import { trim } from "../decorators/trim.ts";
import { any, array, decorate, optional, or } from "../schema/utils.ts";
import { createSanitize } from "./create_sanitize.ts";
import { InvalidValueError } from "./invalid_value_error.ts";

Deno.test("validator/create_sanitize, createSanitize string", () => {
  const s = createSanitize(String);

  assertEquals(s("1"), "1");
  assertEquals(s(""), "");

  const e = assertThrows(
    () => s(30),
    InvalidValueError,
    "It must be a string.",
  );
  assertEquals(e.path, "");
  assertEquals(e.reason, "string");
});

Deno.test("validator/create_sanitize, createSanitize number", () => {
  const s = createSanitize(Number);

  assertEquals(s(30), 30);
  assertEquals(s(3.5), 3.5);

  const e = assertThrows(
    () => s(true),
    InvalidValueError,
    "It must be a number.",
  );
  assertEquals(e.path, "");
  assertEquals(e.reason, "number");
});

Deno.test("validator/create_sanitize, createSanitize boolean", () => {
  const s = createSanitize(Boolean);

  assertEquals(s(true), true);
  assertEquals(s(false), false);

  const e = assertThrows(
    () => s(30),
    InvalidValueError,
    "It must be a boolean.",
  );
  assertEquals(e.path, "");
  assertEquals(e.reason, "boolean");
});

Deno.test("validator/create_sanitize, createSanitize bigint", () => {
  const s = createSanitize(BigInt);

  assertEquals(s(1n), 1n);

  const e = assertThrows(
    () => s(30),
    InvalidValueError,
    "It must be a bigint.",
  );
  assertEquals(e.path, "");
  assertEquals(e.reason, "bigint");
});

Deno.test("validator/create_sanitize, createSanitize symbol", () => {
  const s = createSanitize(Symbol);

  const sym = Symbol(30);
  assertEquals(s(sym), sym);

  const e = assertThrows(
    () => s(30),
    InvalidValueError,
    "It must be a symbol.",
  );
  assertEquals(e.path, "");
  assertEquals(e.reason, "symbol");
});

Deno.test("validator/create_sanitize, createSanitize string value", () => {
  const s = createSanitize("something");

  assertEquals(s("something"), "something");

  const e = assertThrows(
    () => s(30),
    InvalidValueError,
    'It must be a "something".',
  );
  assertEquals(e.path, "");
  assertEquals(e.reason, '"something"');
});

Deno.test("validator/create_sanitize, createSanitize number value", () => {
  const s = createSanitize(1);

  assertEquals(s(1), 1);

  const e = assertThrows(
    () => s(2),
    InvalidValueError,
    "It must be a 1.",
  );
  assertEquals(e.path, "");
  assertEquals(e.reason, "1");
});

Deno.test("validator/create_sanitize, createSanitize boolean value", () => {
  const s = createSanitize(true);

  assertEquals(s(true), true);

  const e = assertThrows(
    () => s(false),
    InvalidValueError,
    "It must be a true.",
  );
  assertEquals(e.path, "");
  assertEquals(e.reason, "true");
});

Deno.test("validator/create_sanitize, createSanitize bigint value", () => {
  const s = createSanitize(1n);

  assertEquals(s(1n), 1n);

  const e = assertThrows(
    () => s(1),
    InvalidValueError,
    "It must be a 1n.",
  );
  assertEquals(e.path, "");
  assertEquals(e.reason, "1n");
});

Deno.test("validator/create_sanitize, createSanitize null", () => {
  const s = createSanitize(null);

  assertEquals(s(null), null);

  const e = assertThrows(
    () => s(undefined),
    InvalidValueError,
    "It must be a null.",
  );
  assertEquals(e.path, "");
  assertEquals(e.reason, "null");
});

Deno.test("validator/create_sanitize, createSanitize undefined", () => {
  const s = createSanitize(undefined);

  assertEquals(s(undefined), undefined);

  const e = assertThrows(
    () => s(null),
    InvalidValueError,
    "It must be a undefined.",
  );
  assertEquals(e.path, "");
  assertEquals(e.reason, "undefined");
});

Deno.test("validator/create_sanitize, createSanitize any", () => {
  const s = createSanitize(any());

  assertEquals(s(undefined), undefined);
  assertEquals(s(1), 1);
  assertEquals(s("1"), "1");
  assertEquals(s(true), true);
  assertEquals(s({}), {});
});

Deno.test("validator/create_sanitize, createSanitize object", () => {
  const Point = {
    x: Number,
    y: Number,
  };
  const s = createSanitize({
    start: Point,
    end: Point,
    empty: {},
  });

  assertEquals(s({ start: { x: 1, y: 2 }, end: { x: 3, y: 4 }, empty: {} }), {
    start: { x: 1, y: 2 },
    end: { x: 3, y: 4 },
    empty: {},
  });

  {
    const e = assertThrows(
      () => s(null),
      InvalidValueError,
      "It must be a object.",
    );
    assertEquals(e.path, "");
    assertEquals(e.reason, "object");
  }
  {
    const e = assertThrows(
      () =>
        s({
          start: { x: 1, y: 2 },
          end: { x: 3 },
        }),
      InvalidValueError,
      "It must be a number.",
    );
    assertEquals(e.path, "end.y");
    assertEquals(e.reason, "number");
  }
});

Deno.test("validator/create_sanitize, createSanitize or", () => {
  const s = createSanitize({
    id: or([String, { "#": String }, Number, BigInt, { _: Number }]),
  });

  assertEquals(s({ id: "1" }), { id: "1" });
  assertEquals(s({ id: { "#": "0x1" } }), { id: { "#": "0x1" } });
  assertEquals(s({ id: 1 }), { id: 1 });
  assertEquals(s({ id: 1n }), { id: 1n });
  assertEquals(s({ id: { _: 10 } }), { id: { _: 10 } });

  {
    const e = assertThrows(
      () => s({ id: true }),
      InvalidValueError,
      "It must be one of the types.",
    );
    assertEquals(e.path, "id");
    assertEquals(e.reason, "or");
  }
});

Deno.test("validator/create_sanitize, createSanitize array of any", () => {
  const s = createSanitize(Array);

  assertEquals(s([]), []);
  assertEquals(s(["1", 1, 1n]), ["1", 1, 1n]);

  assertEquals(s(["1"]), ["1"]);
  assertEquals(s([1]), [1]);
  assertEquals(s([1n]), [1n]);
  assertEquals(s([true]), [true]);
  assertEquals(s([null]), [null]);
  assertEquals(s([undefined]), [undefined]);

  const e = assertThrows(
    () => s({ id: true }),
    InvalidValueError,
    "It must be a array.",
  );
  assertEquals(e.path, "");
  assertEquals(e.reason, "array");
});

Deno.test("validator/create_sanitize, createSanitize array of primitive", () => {
  const s = createSanitize({ ids: array(Number) });

  assertEquals(s({ ids: [] }), { ids: [] });
  assertEquals(s({ ids: [1, 2, 3] }), { ids: [1, 2, 3] });

  const e = assertThrows(
    () => s({ ids: [1, 2, "3"] }),
    InvalidValueError,
    "It must be a number.",
  );
  assertEquals(e.path, "ids[2]");
  assertEquals(e.reason, "number");
});

Deno.test("validator/create_sanitize, createSanitize array of or", () => {
  const s = createSanitize(array(or([String, Number, BigInt])));

  assertEquals(s([]), []);
  assertEquals(s(["1", 1, 1n]), ["1", 1, 1n]);

  assertEquals(s(["1"]), ["1"]);
  assertEquals(s([1]), [1]);
  assertEquals(s([1n]), [1n]);

  const e = assertThrows(
    () => s([1, 2, true]),
    InvalidValueError,
    "It must be one of the types.",
  );
  assertEquals(e.path, "[2]");
  assertEquals(e.reason, "or");
});

Deno.test("validator/create_sanitize, createSanitize decorate", () => {
  const s = createSanitize(decorate(String, [trim(), ip("v4")]));

  assertEquals(s("127.0.0.1"), "127.0.0.1");
  assertEquals(s(" 127.0.0.1  "), "127.0.0.1");

  const e = assertThrows(
    () => s("128.0.0.1.1"),
    InvalidValueError,
    "This is an invalid value from decorator.",
  );
  assertEquals(e.path, "");
  assertEquals(e.reason, "#ip(v4)");
});

Deno.test("validator/create_sanitize, createSanitize complex", () => {
  const typeLat = decorate(Number, between(-90, 90));
  const typeLng = decorate(Number, between(-180, 180));
  const s = createSanitize({
    id: Number,
    email: decorate(String, [trim(), email()]),
    name: optional(String),
    password: decorate(String, lengthBetween(8, 20)),
    areas: array({
      lat: typeLat,
      lng: typeLng,
    }),
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

  assertEquals(
    s({
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
    {
      id: 30,
      email: "wan2land@gmail.com", // trimmed!
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
    },
  );
});

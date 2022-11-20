import { assertEquals } from "testing/asserts.ts";
import type { Equal, Expect } from "@type-challenges/utils";
import { type ParseSchema } from "./parse_schema.ts";
import { Kind } from "./schema.ts";

type TestPrimitiveTypes = [
  Expect<Equal<ParseSchema<typeof String>, string>>,
  Expect<Equal<ParseSchema<typeof Number>, number>>,
  Expect<Equal<ParseSchema<typeof Boolean>, boolean>>,
  Expect<Equal<ParseSchema<typeof BigInt>, bigint>>,
  Expect<Equal<ParseSchema<typeof Symbol>, symbol>>,
  Expect<Equal<ParseSchema<null>, null>>,
  Expect<Equal<ParseSchema<undefined>, undefined>>,
];

type TestScalarValueTypes = [
  Expect<Equal<ParseSchema<"something">, "something">>,
  Expect<Equal<ParseSchema<30>, 30>>,
  Expect<Equal<ParseSchema<true>, true>>,
  Expect<Equal<ParseSchema<false>, false>>,
  Expect<Equal<ParseSchema<1n>, 1n>>,
];

type Point = { x: typeof Number; y: typeof Number };
type TestObject = [
  Expect<Equal<ParseSchema<{ foo: typeof String }>, { foo: string }>>,
  Expect<
    Equal<
      ParseSchema<{ start: Point; end: Point }>,
      { start: { x: number; y: number }; end: { x: number; y: number } }
    >
  >,
];
type TestArray = [
  Expect<
    Equal<
      ParseSchema<typeof Array>,
      // deno-lint-ignore no-explicit-any
      any[]
    >
  >,
  Expect<
    Equal<
      ParseSchema<[Kind.Array, typeof String]>,
      string[]
    >
  >,
];

type TestOr = [
  Expect<
    Equal<
      ParseSchema<[Kind.Union, (typeof String | typeof Number)[]]>,
      string | number
    >
  >,
  Expect<
    Equal<
      ParseSchema<
        { hello: [Kind.Union, (typeof String | typeof Number | Point)[]] }
      >,
      { hello: string | number | { x: number; y: number } }
    >
  >,
];

type TestDecorator = [
  // with scalar
  Expect<
    Equal<ParseSchema<[Kind.Decorator, typeof String, []]>, string>
  >,
  // with object
  Expect<
    Equal<
      ParseSchema<[Kind.Decorator, { foo: typeof String }, []]>,
      { foo: string }
    >
  >,
  // with array
  Expect<
    Equal<
      ParseSchema<[Kind.Decorator, [Kind.Array, typeof String], []]>,
      string[]
    >
  >,
  // with or
  Expect<
    Equal<
      ParseSchema<
        [
          Kind.Decorator,
          { hello: [Kind.Union, (typeof String | typeof Number | Point)[]] },
          [],
        ]
      >,
      { hello: string | number | { x: number; y: number } }
    >
  >,
];

Deno.test("schema/parse_schema", () => {
  assertEquals(true, true);
});

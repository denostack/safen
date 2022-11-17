// deno-lint-ignore-file no-explicit-any
import { assertEquals } from "testing/asserts.ts";
import type { Equal, Expect } from "@type-challenges/utils";
import { type ParseSchema } from "./parse_schema.ts";

type TestPrimitiveTypes = [
  Expect<Equal<ParseSchema<typeof String>, string>>,
  Expect<Equal<ParseSchema<typeof Number>, number>>,
  Expect<Equal<ParseSchema<typeof Boolean>, boolean>>,
  Expect<Equal<ParseSchema<typeof BigInt>, bigint>>,
  Expect<Equal<ParseSchema<null>, null>>,
  Expect<Equal<ParseSchema<undefined>, undefined>>,
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
      any[]
    >
  >,
  Expect<
    Equal<
      ParseSchema<["array", typeof String]>,
      string[]
    >
  >,
];

type TestOr = [
  Expect<
    Equal<
      ParseSchema<["or", (typeof String | typeof Number)[]]>,
      string | number
    >
  >,
  Expect<
    Equal<
      ParseSchema<{ hello: ["or", (typeof String | typeof Number | Point)[]] }>,
      { hello: string | number | { x: number; y: number } }
    >
  >,
];

Deno.test("schema/parse_schema", () => {
  assertEquals(true, true);
});

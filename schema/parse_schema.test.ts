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

type TestObject = [
  Expect<Equal<ParseSchema<{ foo: typeof String }>, { foo: string }>>,
  Expect<
    Equal<
      ParseSchema<{ foo: typeof String; bar: null }>,
      { foo: string; bar: null }
    >
  >,
];

Deno.test("schema/parse_schema", () => {
  assertEquals(true, true);
});

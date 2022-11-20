import { assertEquals } from "testing/asserts.ts";
import type { Equal, Expect } from "@type-challenges/utils";
import { type EstimateType } from "./estimate_type.ts";
import { Kind } from "./ast.ts";

type TestPrimitiveTypes = [
  Expect<Equal<EstimateType<typeof String>, string>>,
  Expect<Equal<EstimateType<typeof Number>, number>>,
  Expect<Equal<EstimateType<typeof Boolean>, boolean>>,
  Expect<Equal<EstimateType<typeof BigInt>, bigint>>,
  Expect<Equal<EstimateType<typeof Symbol>, symbol>>,
  Expect<Equal<EstimateType<null>, null>>,
  Expect<Equal<EstimateType<undefined>, undefined>>,
];

type TestScalarValueTypes = [
  Expect<Equal<EstimateType<"something">, "something">>,
  Expect<Equal<EstimateType<30>, 30>>,
  Expect<Equal<EstimateType<true>, true>>,
  Expect<Equal<EstimateType<false>, false>>,
  Expect<Equal<EstimateType<1n>, 1n>>,
];

type Point = { x: typeof Number; y: typeof Number };
type TestArray = [
  Expect<
    Equal<
      EstimateType<typeof Array>,
      // deno-lint-ignore no-explicit-any
      any[]
    >
  >,
  Expect<
    Equal<
      EstimateType<[Kind.Array, typeof String]>,
      string[]
    >
  >,
];
type TestObject = [
  Expect<Equal<EstimateType<{ foo: typeof String }>, { foo: string }>>,
  Expect<
    Equal<
      EstimateType<{ start: Point; end: Point }>,
      { start: { x: number; y: number }; end: { x: number; y: number } }
    >
  >,
];

type TestUnion = [
  Expect<
    Equal<
      EstimateType<[Kind.Union, (typeof String | typeof Number)[]]>,
      string | number
    >
  >,
  Expect<
    Equal<
      EstimateType<
        { hello: [Kind.Union, (typeof String | typeof Number | Point)[]] }
      >,
      { hello: string | number | { x: number; y: number } }
    >
  >,
];

type TestDecorator = [
  // with scalar
  Expect<
    Equal<EstimateType<[Kind.Decorator, typeof String, []]>, string>
  >,
  // with object
  Expect<
    Equal<
      EstimateType<[Kind.Decorator, { foo: typeof String }, []]>,
      { foo: string }
    >
  >,
  // with array
  Expect<
    Equal<
      EstimateType<[Kind.Decorator, [Kind.Array, typeof String], []]>,
      string[]
    >
  >,
  // with or
  Expect<
    Equal<
      EstimateType<
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

Deno.test("ast/estimate_type", () => {
  assertEquals(true, true);
});

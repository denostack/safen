import { assertEquals } from "testing/asserts.ts";
import { desugar } from "./desugar.ts";
import { Kind, PrimitiveType } from "./ast.ts";

Deno.test("ast/desugar, desugar primitive", () => {
  assertEquals(desugar(null), [Kind.Primitive, PrimitiveType.Null]);
  assertEquals(desugar(undefined), [Kind.Primitive, PrimitiveType.Undefined]);
  assertEquals(desugar(String), [Kind.Primitive, PrimitiveType.String]);
  assertEquals(desugar(Number), [Kind.Primitive, PrimitiveType.Number]);
  assertEquals(desugar(Boolean), [Kind.Primitive, PrimitiveType.Boolean]);
  assertEquals(desugar(BigInt), [Kind.Primitive, PrimitiveType.BigInt]);
  assertEquals(desugar(Symbol), [Kind.Primitive, PrimitiveType.Symbol]);
});

Deno.test("ast/desugar, desugar literal", () => {
  assertEquals(desugar("foo"), [Kind.Literal, "foo"]);
  assertEquals(desugar(30), [Kind.Literal, 30]);
  assertEquals(desugar(true), [Kind.Literal, true]);
  assertEquals(desugar(false), [Kind.Literal, false]);
  assertEquals(desugar(10n), [Kind.Literal, 10n]);
});

Deno.test("ast/desugar, desugar array", () => {
  assertEquals(
    desugar(Array),
    [Kind.Array, [Kind.Primitive, PrimitiveType.Any]],
  );
  assertEquals(
    desugar([String]),
    [Kind.Array, [Kind.Primitive, PrimitiveType.String]],
  );
  assertEquals(
    desugar([Kind.Array, String]),
    [Kind.Array, [Kind.Primitive, PrimitiveType.String]],
  );
});

Deno.test("ast/desugar, desugar object", () => {
  assertEquals(
    desugar({
      name: String,
      age: Number,
    }),
    [Kind.Object, {
      name: [Kind.Primitive, PrimitiveType.String],
      age: [Kind.Primitive, PrimitiveType.Number],
    }],
  );
  assertEquals(
    desugar([Kind.Object, {
      name: String,
      age: Number,
    }]),
    [Kind.Object, {
      name: [Kind.Primitive, PrimitiveType.String],
      age: [Kind.Primitive, PrimitiveType.Number],
    }],
  );
});

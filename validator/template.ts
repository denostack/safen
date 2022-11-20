import { PrimitiveType } from "../ast/ast.ts";

export const primitiveTypeTemplates = new Map<
  PrimitiveType,
  [
    valid: (value: string) => string,
    invalid: (value: string) => string,
    type: string,
  ]
>([
  [PrimitiveType.Any, [
    () => `true`,
    () => `false`,
    "any",
  ]],
  [PrimitiveType.Null, [
    (v) => `${v} === null`,
    (v) => `${v} !== null`,
    "null",
  ]],
  [PrimitiveType.Undefined, [
    (v) => `typeof ${v} === "undefined"`,
    (v) => `typeof ${v} !== "undefined"`,
    "undefined",
  ]],
  [PrimitiveType.String, [
    (v) => `typeof ${v} === "string"`,
    (v) => `typeof ${v} !== "string"`,
    "string",
  ]],
  [PrimitiveType.Number, [
    (v) => `typeof ${v} === "number"`,
    (v) => `typeof ${v} !== "number"`,
    "number",
  ]],
  [PrimitiveType.Boolean, [
    (v) => `typeof ${v} === "boolean"`,
    (v) => `typeof ${v} !== "boolean"`,
    "boolean",
  ]],
  [PrimitiveType.BigInt, [
    (v) => `typeof ${v} === "bigint"`,
    (v) => `typeof ${v} !== "bigint"`,
    "bigint",
  ]],
  [PrimitiveType.Symbol, [
    (v) => `typeof ${v} === "symbol"`,
    (v) => `typeof ${v} !== "symbol"`,
    "symbol",
  ]],
]);

export const primitiveTemplates = new Map<
  unknown,
  [
    valid: (value: string) => string,
    invalid: (value: string) => string,
    type: string,
  ]
>([
  [String, [
    (v) => `typeof ${v} === "string"`,
    (v) => `typeof ${v} !== "string"`,
    "string",
  ]],
  [Number, [
    (v) => `typeof ${v} === "number"`,
    (v) => `typeof ${v} !== "number"`,
    "number",
  ]],
  [Boolean, [
    (v) => `typeof ${v} === "boolean"`,
    (v) => `typeof ${v} !== "boolean"`,
    "boolean",
  ]],
  [BigInt, [
    (v) => `typeof ${v} === "bigint"`,
    (v) => `typeof ${v} !== "bigint"`,
    "bigint",
  ]],
  [Symbol, [
    (v) => `typeof ${v} === "symbol"`,
    (v) => `typeof ${v} !== "symbol"`,
    "symbol",
  ]],
  [Array, [
    (v) => `Array.isArray(${v})`,
    (v) => `!Array.isArray(${v})`,
    "array",
  ]],
  [null, [(v) => `${v} === null`, (v) => `${v} !== null`, "null"]],
  [undefined, [
    (v) => `typeof ${v} === "undefined"`,
    (v) => `typeof ${v} !== "undefined"`,
    "undefined",
  ]],
]);

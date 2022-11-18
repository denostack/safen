export type Schema =
  | SchemaPrimitiveType
  | SchemaEmptyType
  | SchemaObjectType
  // deno-lint-ignore no-explicit-any
  | SchemaArrayType<any>
  // deno-lint-ignore no-explicit-any
  | SchemaOrType<any>
  // deno-lint-ignore no-explicit-any
  | SchemaDecorateType<any>
  | SchemaValueType;

export type SchemaPrimitiveType =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | BigIntConstructor
  | SymbolConstructor
  | ArrayConstructor;

export type SchemaEmptyType = null | undefined;

export interface SchemaObjectType {
  [key: string]: Schema;
}

export type SchemaArrayType<T extends Schema> = [type: "array", of: T];
export type SchemaOrType<T extends Schema> = [type: "or", types: T[]];
export type SchemaDecorateType<T extends Schema> = [
  type: "decorate",
  of: T,
  // deno-lint-ignore no-explicit-any
  decorators: SchemaDecorator<any>[],
];

export type SchemaValueType = string | number | boolean | bigint;

export interface SchemaDecorator<T> {
  name: string;
  validate?(v: string): string;
  sanitize?(v: string): string;
}

export enum Kind {
  Primitive = 1,

  Any = 11,
  Object = 12,
  Array = 13,

  Or = 21,

  Decorator = 31,
}

export type Schema =
  | SchemaSugarPrimitive
  | SchemaSugarObject
  | SchemaSugarValue
  | SchemaAny
  // deno-lint-ignore no-explicit-any
  | SchemaArray<any>
  // deno-lint-ignore no-explicit-any
  | SchemaOr<any>
  // deno-lint-ignore no-explicit-any
  | SchemaDecorator<any>;

export type SchemaSugarPrimitive =
  | null
  | undefined
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | BigIntConstructor
  | SymbolConstructor
  | ArrayConstructor;

export interface SchemaSugarObject {
  [key: string]: Schema;
}

export type SchemaSugarValue = string | number | boolean | bigint;

export type SchemaAny = [kind: Kind.Any];
export type SchemaArray<T extends Schema> = [kind: Kind.Array, of: T];
export type SchemaOr<T extends Schema> = [kind: Kind.Or, types: T[]];
export type SchemaDecorator<T extends Schema> = [
  kind: Kind.Decorator,
  of: T,
  // deno-lint-ignore no-explicit-any
  decorators: SafenDecorator<any>[],
];

export interface SafenDecorator<T> {
  name: string;
  validate?(v: string): string;
  sanitize?(v: string): string;
}

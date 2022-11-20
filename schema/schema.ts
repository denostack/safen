import { Decorator } from "../decorator/decorator.ts";

export enum Kind {
  Primitive = 1,

  Any = 11,
  Object = 12,
  Array = 13,

  Union = 21,

  Decorator = 31,
}

export type Schema =
  | SchemaSugarPrimitive
  | SchemaSugarObject
  | SchemaSugarLiteral
  | SchemaAny
  // deno-lint-ignore no-explicit-any
  | SchemaArray<any>
  // deno-lint-ignore no-explicit-any
  | SchemaUnion<any>
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

export type SchemaSugarLiteral = string | number | boolean | bigint;

export type SchemaAny = [kind: Kind.Any];
export type SchemaArray<T extends Schema> = [kind: Kind.Array, of: T];
export type SchemaUnion<T extends Schema> = [kind: Kind.Union, types: T[]];
export type SchemaDecorator<T extends Schema> = [
  kind: Kind.Decorator,
  of: T,
  // deno-lint-ignore no-explicit-any
  decorators: Decorator<any>[],
];

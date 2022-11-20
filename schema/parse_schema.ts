import {
  Schema,
  SchemaAny,
  SchemaArray,
  SchemaDecorator,
  SchemaSugarLiteral,
  SchemaSugarObject,
  SchemaUnion,
} from "./schema.ts";

export type ParseSchema<T extends Schema> = T extends StringConstructor ? string
  : T extends NumberConstructor ? number
  : T extends BooleanConstructor ? boolean
  : T extends BigIntConstructor ? bigint
  : T extends SymbolConstructor ? symbol
  // deno-lint-ignore no-explicit-any
  : T extends ArrayConstructor ? any[]
  : T extends infer U extends (null | undefined) ? U
  : T extends infer U extends SchemaSugarLiteral ? U
  : T extends SchemaSugarObject ? { [K in keyof T]: ParseSchema<T[K]> }
  // deno-lint-ignore no-explicit-any
  : T extends SchemaAny ? any
  : T extends SchemaArray<Schema> ? ParseSchema<T[1]>[]
  : T extends SchemaUnion<Schema> ? ParseSchema<T[1][number]>
  : T extends SchemaDecorator<Schema> ? ParseSchema<T[1]>
  : never;

import {
  Schema,
  SchemaArrayType,
  SchemaDecorateType,
  SchemaEmptyType,
  SchemaObjectType,
  SchemaOrType,
  SchemaValueType,
} from "./schema.ts";

export type ParseSchema<T extends Schema> = T extends StringConstructor ? string
  : T extends NumberConstructor ? number
  : T extends BooleanConstructor ? boolean
  : T extends BigIntConstructor ? bigint
  : T extends SymbolConstructor ? symbol
  // deno-lint-ignore no-explicit-any
  : T extends ArrayConstructor ? any[]
  : T extends infer U extends SchemaEmptyType ? U
  : T extends SchemaObjectType ? { [K in keyof T]: ParseSchema<T[K]> }
  : T extends SchemaArrayType<Schema> ? ParseSchema<T[1]>[]
  : T extends SchemaOrType<Schema> ? ParseSchema<T[1][number]>
  : T extends SchemaDecorateType<Schema> ? ParseSchema<T[1]>
  : T extends infer U extends SchemaValueType ? U
  : never;

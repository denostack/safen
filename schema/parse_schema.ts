// deno-lint-ignore-file no-explicit-any
import { Schema } from "./schema.ts";

export type ParseSchema<T extends Schema> = T extends StringConstructor ? string
  : T extends NumberConstructor ? number
  : T extends BooleanConstructor ? boolean
  : T extends BigIntConstructor ? bigint
  : T extends ArrayConstructor ? any[]
  : T extends null ? null
  : T extends undefined ? undefined
  : T extends { [key: string]: Schema } ? { [K in keyof T]: ParseSchema<T[K]> }
  : T extends [type: "array", of: Schema] ? ParseSchema<T[1]>[]
  : T extends [type: "or", types: Schema[]] ? ParseSchema<T[1][number]>
  : T extends infer U extends (string | number | boolean | bigint) ? U
  : never;

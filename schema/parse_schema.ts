import { Schema } from "./schema.ts";

export type ParseSchema<T extends Schema> = T extends StringConstructor ? string
  : T extends NumberConstructor ? number
  : T extends BooleanConstructor ? boolean
  : T extends BigIntConstructor ? bigint
  : T extends null ? null
  : T extends undefined ? undefined
  : T extends { [key: string]: Schema } ? { [K in keyof T]: ParseSchema<T[K]> }
  : never;

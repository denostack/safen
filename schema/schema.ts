export type Schema =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | BigIntConstructor
  | ArrayConstructor
  | null
  | undefined
  | { [key: string]: Schema }
  | [type: "array", of: Schema]
  | [type: "or", types: Schema[]]
  | string
  | number
  | boolean
  | bigint;

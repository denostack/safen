export type Schema =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | BigIntConstructor
  | null
  | undefined
  | { [key: string]: Schema };

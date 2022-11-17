import { Schema } from "./schema.ts";

export function or<T extends Schema>(types: T[]): [type: "or", types: T[]] {
  return ["or", types];
}

export function array<T extends Schema>(of: T): [type: "array", of: T] {
  return ["array", of];
}

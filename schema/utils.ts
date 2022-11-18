import { ParseSchema } from "./parse_schema.ts";
import {
  Schema,
  SchemaArrayType,
  SchemaDecorateType,
  SchemaDecorator,
  SchemaOrType,
} from "./schema.ts";

export function or<T extends Schema>(types: T[]): SchemaOrType<T> {
  return ["or", types];
}

export function array<T extends Schema>(of: T): SchemaArrayType<T> {
  return ["array", of];
}

export function decorate<T extends Schema>(
  of: T,
  decorator: SchemaDecorator<ParseSchema<T>>,
): SchemaDecorateType<T>;
export function decorate<T extends Schema>(
  of: T,
  decorators: SchemaDecorator<ParseSchema<T>>[],
): SchemaDecorateType<T>;
export function decorate<T extends Schema>(
  of: T,
  decorator: SchemaDecorator<ParseSchema<T>> | SchemaDecorator<
    ParseSchema<T>
  >[],
): SchemaDecorateType<T> {
  return ["decorate", of, Array.isArray(decorator) ? decorator : [decorator]];
}

export function optional<T extends Schema>(
  of: T,
): SchemaOrType<T | undefined> {
  return ["or", [undefined, of]];
}

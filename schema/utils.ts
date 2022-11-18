import { ParseSchema } from "./parse_schema.ts";
import {
  Kind,
  SafenDecorator,
  Schema,
  SchemaAny,
  SchemaArray,
  SchemaDecorator,
  SchemaOr,
} from "./schema.ts";

export function any(): SchemaAny {
  return [Kind.Any];
}

export function or<T extends Schema>(types: T[]): SchemaOr<T> {
  return [Kind.Or, types];
}

export function array<T extends Schema>(of: T): SchemaArray<T> {
  return [Kind.Array, of];
}

export function decorate<T extends Schema>(
  of: T,
  decorator: SafenDecorator<ParseSchema<T>>,
): SchemaDecorator<T>;
export function decorate<T extends Schema>(
  of: T,
  decorators: SafenDecorator<ParseSchema<T>>[],
): SchemaDecorator<T>;
export function decorate<T extends Schema>(
  of: T,
  decorator: SafenDecorator<ParseSchema<T>> | SafenDecorator<
    ParseSchema<T>
  >[],
): SchemaDecorator<T> {
  return [
    Kind.Decorator,
    of,
    Array.isArray(decorator) ? decorator : [decorator],
  ];
}

export function optional<T extends Schema>(
  of: T,
): SchemaOr<T | undefined> {
  return [Kind.Or, [undefined, of]];
}

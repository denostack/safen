import { Decorator } from "../decorator/decorator.ts";
import { ParseSchema } from "./parse_schema.ts";
import {
  Kind,
  Schema,
  SchemaAny,
  SchemaArray,
  SchemaDecorator,
  SchemaUnion,
} from "./schema.ts";

export function any(): SchemaAny {
  return [Kind.Any];
}

export function or<T extends Schema>(types: T[]): SchemaUnion<T> {
  return [Kind.Union, types];
}

export function array<T extends Schema>(of: T): SchemaArray<T> {
  return [Kind.Array, of];
}

export function decorate<T extends Schema>(
  of: T,
  decorator: Decorator<ParseSchema<T>>,
): SchemaDecorator<T>;
export function decorate<T extends Schema>(
  of: T,
  decorators: Decorator<ParseSchema<T>>[],
): SchemaDecorator<T>;
export function decorate<T extends Schema>(
  of: T,
  decorator: Decorator<ParseSchema<T>> | Decorator<
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
): SchemaUnion<T | undefined> {
  return [Kind.Union, [undefined, of]];
}

import { Decorator } from "../decorator/decorator.ts";
import {
  Ast,
  AstArray,
  AstDecorator,
  AstPrimitive,
  AstUnion,
  Kind,
  PrimitiveType,
} from "./ast.ts";
import { EstimateType } from "./estimate_type.ts";

export function any(): AstPrimitive {
  return [Kind.Primitive, PrimitiveType.Any];
}

export function or<T extends Ast>(types: T[]): AstUnion<T> {
  return [Kind.Union, types];
}

export function union<T extends Ast>(types: T[]): AstUnion<T> {
  return [Kind.Union, types];
}

export function array<T extends Ast>(of: T): AstArray<T> {
  return [Kind.Array, of];
}

export function decorate<T extends Ast>(
  of: T,
  decorator: Decorator<EstimateType<T>>,
): AstDecorator<T>;
export function decorate<T extends Ast>(
  of: T,
  decorators: Decorator<EstimateType<T>>[],
): AstDecorator<T>;
export function decorate<T extends Ast>(
  of: T,
  decorator: Decorator<EstimateType<T>> | Decorator<
    EstimateType<T>
  >[],
): AstDecorator<T> {
  return [
    Kind.Decorator,
    of,
    Array.isArray(decorator) ? decorator : [decorator],
  ];
}

export function optional<T extends Ast>(
  of: T,
): AstUnion<T | undefined> {
  return [Kind.Union, [undefined, of]];
}

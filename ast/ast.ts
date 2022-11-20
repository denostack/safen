// deno-lint-ignore-file no-explicit-any

import { Decorator } from "../decorator/decorator.ts";

export enum Kind {
  Primitive = 1,
  Literal = 2,

  Array = 11,
  Object = 12,

  Union = 21,

  Decorator = 31,
}

export enum PrimitiveType {
  Any = 0,
  Null = 1,
  Undefined = 2,
  String = 3,
  Number = 4,
  Boolean = 5,
  BigInt = 6,
  Symbol = 7,
}

export type Ast =
  | AstSugarPrimitive
  | AstSugarLiteral
  | AstSugarArray
  | AstSugarAnyArray
  | AstSugarObject
  | AstStrict;

export type AstSugarPrimitive =
  | null
  | undefined
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | BigIntConstructor
  | SymbolConstructor;

export type AstSugarLiteral = string | number | boolean | bigint;
export type AstSugarArray = [Ast];
export type AstSugarAnyArray = ArrayConstructor; // map to [array, [primitive, any]];
export interface AstSugarObject {
  [key: string]: Ast;
}

// Strict
export type AstStrict =
  | AstPrimitive
  | AstLiteral
  | AstArray<any>
  | AstObject<any>
  | AstUnion<any>
  | AstDecorator<any>;

export type AstPrimitive = [kind: Kind.Primitive, type: PrimitiveType];
export type AstLiteral = [
  kind: Kind.Literal,
  type: string | number | boolean | bigint,
];
export type AstArray<T extends Ast> = [kind: Kind.Array, of: T];
export type AstObject<T extends Ast> = [
  kind: Kind.Object,
  obj: { [key: string]: T },
];
export type AstUnion<T extends Ast> = [kind: Kind.Union, types: T[]];
export type AstDecorator<T extends Ast> = [
  kind: Kind.Decorator,
  of: T,
  decorators: Decorator<any>[],
];

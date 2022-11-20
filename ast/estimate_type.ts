// deno-lint-ignore-file no-explicit-any

import {
  Ast,
  AstArray,
  AstDecorator,
  AstLiteral,
  AstObject,
  AstPrimitive,
  AstSugarArray,
  AstSugarLiteral,
  AstSugarObject,
  AstUnion,
  PrimitiveType,
} from "./ast.ts";

export interface PrimitiveTypeMap {
  [PrimitiveType.Any]: any;
  [PrimitiveType.Null]: null;
  [PrimitiveType.Undefined]: undefined;
  [PrimitiveType.String]: string;
  [PrimitiveType.Number]: number;
  [PrimitiveType.Boolean]: boolean;
  [PrimitiveType.BigInt]: bigint;
  [PrimitiveType.Symbol]: symbol;
}

export type EstimateType<T extends Ast> = T extends StringConstructor ? string
  : T extends NumberConstructor ? number
  : T extends BooleanConstructor ? boolean
  : T extends BigIntConstructor ? bigint
  : T extends SymbolConstructor ? symbol
  : T extends ArrayConstructor ? any[] // anyarray
  : T extends infer U extends (null | undefined) ? U
  : T extends infer U extends AstSugarLiteral ? U
  : T extends AstSugarObject ? { [K in keyof T]: EstimateType<T[K]> }
  : T extends AstSugarArray ? EstimateType<T[0]>[]
  : T extends AstPrimitive ? PrimitiveTypeMap[T[1]]
  : T extends AstLiteral ? T[1]
  : T extends AstArray<any> ? EstimateType<T[1]>[]
  : T extends AstObject<any> ? { [K in keyof T[1]]: EstimateType<T[1][K]> }
  : T extends AstUnion<any> ? EstimateType<T[1][number]>
  : T extends AstDecorator<any> ? EstimateType<T[1]>
  : never;

import { Ast, AstStrict, Kind, PrimitiveType } from "./ast.ts";

export function desugar(ast: Ast): AstStrict {
  switch (ast) {
    case null:
      return [Kind.Primitive, PrimitiveType.Null];
    case undefined:
      return [Kind.Primitive, PrimitiveType.Undefined];
    case String:
      return [Kind.Primitive, PrimitiveType.String];
    case Number:
      return [Kind.Primitive, PrimitiveType.Number];
    case Boolean:
      return [Kind.Primitive, PrimitiveType.Boolean];
    case BigInt:
      return [Kind.Primitive, PrimitiveType.BigInt];
    case Symbol:
      return [Kind.Primitive, PrimitiveType.Symbol];
    case Array:
      return [Kind.Array, [Kind.Primitive, PrimitiveType.Any]];
  }
  switch (typeof ast) {
    case "string":
      return [Kind.Literal, ast];
    case "number":
      return [Kind.Literal, ast];
    case "boolean":
      return [Kind.Literal, ast];
    case "bigint":
      return [Kind.Literal, ast];
  }
  if (Array.isArray(ast)) {
    if (ast.length === 1) {
      return [Kind.Array, desugar(ast[0])];
    }
    switch (ast[0]) {
      case Kind.Array:
        return [Kind.Array, desugar(ast[1])];
      case Kind.Object:
        return desugar(ast[1]);
      case Kind.Union:
        return [Kind.Union, ast[1].map(desugar)];
      case Kind.Decorator:
        return [Kind.Decorator, desugar(ast[1]), ast[2]];
    }
    return ast;
  }
  if (typeof ast === "object") {
    const obj: Record<string, AstStrict> = {};
    for (const key in ast) {
      obj[key] = desugar(ast[key]);
    }
    return [Kind.Object, obj];
  }
  throw new Error("..");
}

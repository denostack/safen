import { Ast } from "../ast/ast.ts";
import { desugar } from "../ast/desugar.ts";
import { EstimateType } from "../ast/estimate_type.ts";
import { createSanitizeSource } from "./create_sanitize.ts";

export function createValidate<T extends Ast>(
  ast: T,
): (data: unknown) => data is EstimateType<T> {
  const { source, decorators } = createSanitizeSource(desugar(ast));
  return new Function(
    "_d",
    `${source}\nreturn function(d){try{_0(d,'');return true}catch{return false}}`,
  )(decorators);
}

import { Ast } from "./ast/ast.ts";
import { any, array, decorate, optional, union } from "./ast/utils.ts";
import { EstimateType } from "./ast/estimate_type.ts";
import { createValidate } from "./validator/create_validate.ts";
import { createSanitize } from "./validator/create_sanitize.ts";
import { Decorator } from "./decorator/decorator.ts";
import { d, PredefinedDecorators } from "./decorators.ts";

export type DecoratorFactory<T extends Ast> = (
  d: PredefinedDecorators,
) => Decorator<EstimateType<T>> | Decorator<EstimateType<T>>[];

const helpers = {
  any() {
    return any();
  },
  union<T extends Ast>(types: T[]) {
    return union(types);
  },
  array<T extends Ast>(of: T) {
    return array(of);
  },
  decorate<T extends Ast>(of: T, by: DecoratorFactory<T>) {
    return decorate(of, by(d) as Decorator<EstimateType<T>>);
  },
  optional<T extends Ast>(of: T) {
    return optional(of);
  },
};

export const v = Object.assign(function <T extends Ast>(ast: T) {
  return createValidate<T>(ast);
}, helpers);

export const s = Object.assign(function <T extends Ast>(ast: T) {
  return createSanitize<T>(ast);
}, helpers);

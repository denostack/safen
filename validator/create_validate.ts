import {
  Ast,
  AstLiteral,
  AstPrimitive,
  AstStrict,
  Kind,
  PrimitiveType,
} from "../ast/ast.ts";
import { desugar } from "../ast/desugar.ts";
import { EstimateType } from "../ast/estimate_type.ts";
import { Decorator } from "../decorator/decorator.ts";

const astToIndex = new Map<unknown, number>();
let fns: string[] = [];
const decoratorToIdx = new Map<Decorator<unknown>, number>();
let decorators: Decorator<unknown>[] = [];

export function stringifyLiteral(
  value: string | number | boolean | bigint,
): string {
  switch (typeof value) {
    case "string":
    case "number":
    case "boolean": {
      return JSON.stringify(value);
    }
    case "bigint": {
      return `${value.toString()}n`;
    }
  }
  throw new Error("Unknown literal type");
}

const comparators = ["!==", "==="];
export function condPrimitive(
  ast: AstPrimitive,
  is: 1 | 0,
  value: string,
): string {
  switch (ast[1]) {
    case PrimitiveType.Any: {
      return is ? "true" : "false";
    }
    case PrimitiveType.Null: {
      return `${value}${comparators[is]}null`;
    }
    case PrimitiveType.Undefined: {
      return `typeof ${value}${comparators[is]}"undefined"`;
    }
    case PrimitiveType.String: {
      return `typeof ${value}${comparators[is]}"string"`;
    }
    case PrimitiveType.Number: {
      return `typeof ${value}${comparators[is]}"number"`;
    }
    case PrimitiveType.Boolean: {
      return `typeof ${value}${comparators[is]}"boolean"`;
    }
    case PrimitiveType.BigInt: {
      return `typeof ${value}${comparators[is]}"bigint"`;
    }
    case PrimitiveType.Symbol: {
      return `typeof ${value}${comparators[is]}"symbol"`;
    }
  }
  throw new Error("unsupported primitive type");
}

export function condLiteral(ast: AstLiteral, is: 1 | 0, value: string): string {
  const literalValue = stringifyLiteral(ast[1]);
  return `${value}${comparators[is]}${literalValue}`;
}

function condRoot(ast: AstStrict, is: 1 | 0, value: string): string {
  switch (ast[0]) {
    case Kind.Primitive: {
      return condPrimitive(ast, is, value);
    }
    case Kind.Literal: {
      return condLiteral(ast, is, value);
    }
  }
  if (!astToIndex.has(ast)) {
    traverse(ast);
  }
  const idx = astToIndex.get(ast)!;
  return is ? `_${idx}(${value})` : `!_${idx}(${value})`;
}

function traverse(ast: AstStrict) {
  const idx = fns.length;
  const name = `_${idx}`;

  astToIndex.set(ast, idx);
  fns.push("");

  switch (ast[0]) {
    case Kind.Primitive: {
      fns[idx] = `function ${name}(v){return ${condPrimitive(ast, 1, "v")}}`;
      return;
    }
    case Kind.Literal: {
      fns[idx] = `function ${name}(v){return ${condLiteral(ast, 1, "v")}}`;
      return;
    }
    case Kind.Array: {
      let result = `function ${name}(v){`;
      result += `if(!Array.isArray(v))return false;`;
      result += `for(let i=0;i<v.length;i++)if(${
        condRoot(ast[1], 0, "v[i]")
      })return false;`;
      result += `return true`;
      result += `}`; // end fn
      fns[idx] = result;
      return;
    }
    case Kind.Object: {
      const entries = Object.entries(ast[1]);
      if (entries.length === 0) {
        fns[idx] = `function ${name}(v){return typeof v==="object"&&v!==null}`;
        return;
      }
      let result = `function ${name}(v){`; // start fn
      result += `if(typeof v!=="object"||v===null)return false;`;
      result += `return `;
      result += entries.map(([key, child]) =>
        condRoot(child, 1, `v[${JSON.stringify(key)}]`)
      ).join("&&");
      result += `}`; // end fn
      fns[idx] = result;
      return;
    }
    case Kind.Union: {
      const [_, children] = ast;
      if (children.length === 0) {
        throw new Error("Union must have at least one subtype");
      }
      fns[idx] = `function ${name}(v){return ${
        children.map((child) => condRoot(child, 1, "v")).join("||")
      }}`;
      return;
    }
    case Kind.Decorator: {
      let result = `function ${name}(v){`;
      const pairs = ast[2].map((decorator): [number, Decorator<unknown>] => {
        if (!decoratorToIdx.has(decorator)) {
          decoratorToIdx.set(decorator, decorators.length);
          decorators.push(decorator);
        }
        return [decoratorToIdx.get(decorator)!, decorator];
      });
      for (const [dId, decorator] of pairs) {
        if (decorator.preprocess) {
          result += `v=_d[${dId}].preprocess(v);`;
        }
      }
      result += `if(${condRoot(ast[1], 0, "v")})return false;`;
      for (const [dId, decorator] of pairs) {
        if (decorator.validate) {
          result += `if(!_d[${dId}].validate(v))return false;`;
        }
        if (decorator.transform) {
          result += `v=_d[${dId}].transform(v);`;
        }
      }
      result += `return true`;
      result += `}`;
      fns[idx] = result;
      return;
    }
  }
  throw new Error("Invalid schema");
}

export function createValidateSource(ast: AstStrict) {
  fns = [];
  decorators = [];
  astToIndex.clear();
  decoratorToIdx.clear();
  traverse(ast);
  return {
    source: fns.join("\n"),
    decorators,
  };
}

export function createValidate<T extends Ast>(
  ast: T,
): (data: unknown) => data is EstimateType<T> {
  const { source, decorators } = createValidateSource(desugar(ast));
  return new Function(
    "_d",
    `${source}\nreturn _0`,
  )(decorators);
}

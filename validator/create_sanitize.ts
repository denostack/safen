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
import {
  condLiteral,
  condPrimitive,
  stringifyLiteral,
} from "./create_validate.ts";
import { InvalidValueError } from "./invalid_value_error.ts";

const astToIndex = new Map<AstStrict, number>();
let fns: string[] = [];
const decoratorToIdx = new Map<Decorator<unknown>, number>();
let decorators: Decorator<unknown>[] = [];

type InternalError =
  | InternalUnionError
  | InternalTypeError
  | InternalDecoratorError;

interface InternalUnionError {
  type: "union";
  path: string;
}

interface InternalTypeError {
  type: "type";
  reason: string;
  path: string;
}

interface InternalDecoratorError {
  type: "decorator";
  reason: string;
  path: string;
}

function throwUnionError(path = "p") {
  return `throw{type:"union",path:${path}}`;
}

function throwTypeError(type: string, path = "p") {
  return `throw{type:"type",reason:${JSON.stringify(type)},path:${path}}`;
}

function throwDecoratorError(reason: string, path = "p") {
  return `throw{type:"decorator",reason:${
    JSON.stringify(reason)
  },path:${path}}`;
}

function invalidPrimitive(ast: AstPrimitive, value = "v", path = "p"): string {
  switch (ast[1]) {
    case PrimitiveType.Any: {
      return "";
    }
    case PrimitiveType.Null: {
      return `if(${value}!==null)${throwTypeError("null", path)};`;
    }
    case PrimitiveType.Undefined: {
      return `if(typeof ${value}!=="undefined")${
        throwTypeError("undefined", path)
      };`;
    }
    case PrimitiveType.String: {
      return `if(typeof ${value}!=="string")${throwTypeError("string", path)};`;
    }
    case PrimitiveType.Number: {
      return `if(typeof ${value}!=="number")${throwTypeError("number", path)};`;
    }
    case PrimitiveType.Boolean: {
      return `if(typeof ${value}!=="boolean")${
        throwTypeError("boolean", path)
      };`;
    }
    case PrimitiveType.BigInt: {
      return `if(typeof ${value}!=="bigint")${throwTypeError("bigint", path)};`;
    }
    case PrimitiveType.Symbol: {
      return `if(typeof ${value}!=="symbol")${throwTypeError("symbol", path)};`;
    }
  }
  throw new Error("unsupported primitive type");
}

function invalidLiteral(ast: AstLiteral, value: string, path = "p"): string {
  const literalValue = stringifyLiteral(ast[1]);
  return `if(${value}!==${literalValue})${throwTypeError(literalValue, path)};`;
}

function invalidAst(ast: AstStrict, value: string, path = "p"): string {
  switch (ast[0]) {
    case Kind.Primitive: {
      return invalidPrimitive(ast, value, path);
    }
    case Kind.Literal: {
      return invalidLiteral(ast, value, path);
    }
  }
  if (!astToIndex.has(ast)) {
    traverse(ast);
  }
  const idx = astToIndex.get(ast)!;
  return `${value}=_${idx}(${value},${path});`;
}

function traverse(ast: AstStrict) {
  const idx = fns.length;
  const name = `_${idx}`;

  astToIndex.set(ast, idx);
  fns.push("");

  switch (ast[0]) {
    case Kind.Primitive: {
      fns[idx] = `function ${name}(v,p){${invalidPrimitive(ast, "v")}return v}`;
      return;
    }
    case Kind.Literal: {
      fns[idx] = `function ${name}(v,p){${invalidLiteral(ast, "v")}return v}`;
      return;
    }
    case Kind.Array: {
      let result = `function ${name}(v,p){`;
      result += `if(!Array.isArray(v))${throwTypeError("array")};`;
      result += `for(let i=0;i<v.length;i++){`;
      result += invalidAst(ast[1], "v[i]", 'p+"["+i+"]"');
      result += `}return v}`;
      fns[idx] = result;
      return;
    }
    case Kind.Object: {
      let result = `function ${name}(v,p){`;
      result += `if(typeof v!=="object"||v===null)${throwTypeError("object")};`;
      for (const [key, child] of Object.entries(ast[1])) {
        result += invalidAst(
          child,
          `v[${JSON.stringify(key)}]`,
          `p+${JSON.stringify("." + key)}`,
        );
      }
      result += `return v}`;
      fns[idx] = result;
      return;
    }
    case Kind.Union: {
      const [_, children] = ast;
      if (children.length === 0) {
        throw new Error("Union must have at least one subtype");
      }
      let result = `function ${name}(v,p){`;
      for (const child of ast[1]) {
        switch (child[0]) {
          case Kind.Primitive: {
            result += `if(${condPrimitive(child, 1, "v")})return v;`;
            break;
          }
          case Kind.Literal: {
            result += `if(${condLiteral(child, 1, "v")})return v;`;
            break;
          }
          default: {
            if (!astToIndex.has(child)) {
              traverse(child);
            }
            const idx = astToIndex.get(child)!;
            result += `try{return _${idx}(v,p)}catch{}`;
          }
        }
      }
      result += `${throwUnionError("p")};`;
      result += `}`;
      fns[idx] = result;
      return;
    }
    case Kind.Decorator: {
      let result = `function ${name}(v,p){`;
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
      result += invalidAst(ast[1], "v");
      for (const [dId, decorator] of pairs) {
        if (decorator.validate) {
          result += `if(!_d[${dId}].validate(v))${
            throwDecoratorError(decorator.name)
          };`;
        }
        if (decorator.transform) {
          result += `v=_d[${dId}].transform(v);`;
        }
      }
      result += `return v}`;
      fns[idx] = result;
      return;
    }
  }
  throw new Error("Invalid ast");
}

export function createSanitizeSource(ast: AstStrict) {
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

function mapCreateError(error: InternalError) {
  if (error.type === "decorator") {
    const path = error.path.replace(/^\.+/, "");
    return new InvalidValueError(
      "This is an invalid value from decorator.",
      `#${error.reason}`,
      path,
    );
  }
  if (error.type === "type") {
    const path = error.path.replace(/^\.+/, "");
    return new InvalidValueError(
      `It must be a ${error.reason}.`,
      `${error.reason}`,
      path,
    );
  }
  if (error.type === "union") {
    const path = error.path.replace(/^\.+/, "");
    return new InvalidValueError(
      `It must be one of the types.`,
      "union",
      path,
    );
  }
  throw new Error("Invalid error type");
}

export function createSanitize<T extends Ast>(
  ast: T,
): (data: unknown) => EstimateType<T> {
  const { source, decorators } = createSanitizeSource(desugar(ast));
  return new Function(
    "_d",
    "_e",
    `${source}\nreturn function(d){try{return _0(d,'')}catch(e){throw _e(e)}}`,
  )(decorators, mapCreateError);
}

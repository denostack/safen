import { Decorator } from "../decorator/decorator.ts";
import { EstimateType } from "../ast/estimate_type.ts";
import {
  Ast,
  AstLiteral,
  AstPrimitive,
  AstStrict,
  AstUnion,
  Kind,
} from "../ast/ast.ts";
import { InvalidValueError } from "./invalid_value_error.ts";
import { primitiveTypeTemplates } from "./template.ts";
import { desugar } from "../ast/desugar.ts";

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

function stringifyLiteral(value: string | number | boolean | bigint): string {
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

function throwUnionError(path = "p") {
  return `throw {type:"union",path:${path}}`;
}

function throwTypeError(type: string, path = "p") {
  return `throw {type:"type",reason:${JSON.stringify(type)},path:${path}}`;
}

function throwDecoratorError(reason: string, path = "p") {
  return `throw {type:"decorator",reason:${
    JSON.stringify(reason)
  },path:${path}}`;
}

function invalidPrimitive(ast: AstPrimitive, value = "v", path = "p"): string {
  const [_, invalid, type] = primitiveTypeTemplates.get(ast[1])!;
  return `if(${invalid(value)})${throwTypeError(type, path)};`;
}

function invalidLiteral(ast: AstLiteral, value = "v", path = "p"): string {
  const literalValue = stringifyLiteral(ast[1]);
  return `if(${value}!==${literalValue})${throwTypeError(literalValue, path)};`;
}

function invalidUnion(
  ast: AstUnion<AstStrict>,
  value = "v",
  path = "p",
): string {
  let result = "";
  for (const child of ast[1]) {
    switch (child[0]) {
      case Kind.Primitive: {
        const [valid] = primitiveTypeTemplates.get(child[1])!;
        result += `if(${valid(value)})return ${value};`;
        break;
      }
      case Kind.Literal: {
        const literalValue = stringifyLiteral(child[1]);
        result += `if(${value}===${literalValue})return ${value};`;
        break;
      }
      default: {
        if (!astToIndex.has(child)) {
          traverse(child);
        }
        const idx = astToIndex.get(child)!;
        result += `try{return _${idx}(${value},${path})}catch{}`;
      }
    }
  }
  result += `${throwUnionError(path)};`;
  return result;
}

function invalidAst(ast: AstStrict, value = "v", path = "p"): string {
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
      fns[idx] = `function ${name}(v,p){${invalidUnion(ast)}}`;
      return;
    }
    case Kind.Decorator: {
      let result = `function ${name}(v,p){`;
      result += invalidAst(ast[1]);
      for (const decorator of ast[2]) {
        if (!decoratorToIdx.has(decorator)) {
          decoratorToIdx.set(decorator, decorators.length);
          decorators.push(decorator);
        }
        const decoratorId = decoratorToIdx.get(decorator)!;
        if (decorator.validate) {
          result += `if(!_d[${decoratorId}].validate(v))${
            throwDecoratorError(decorator.name)
          };`;
        }
        if (decorator.sanitize) {
          result += `v=_d[${decoratorId}].sanitize(v);`;
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

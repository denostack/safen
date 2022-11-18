import { ParseSchema } from "../schema/parse_schema.ts";
import { Schema } from "../schema/schema.ts";
import { InvalidValueError } from "./invalid_value_error.ts";
import { primitiveTemplates } from "./template.ts";

const schemaToIdx = new Map<unknown, number>();
let fns: string[] = [];

function throwError(message: string, type: string, path = "p") {
  return `throw error(${JSON.stringify(message)},${
    JSON.stringify(type)
  },${path})`;
}

function traverse(schema: Schema) {
  const idx = fns.length;
  const name = `_${idx}`;

  const template = primitiveTemplates.get(schema);
  if (template) {
    schemaToIdx.set(schema, idx);
    const [_, invalid, type] = template;
    const message = `It must be a ${type}.`;
    fns.push(
      `function ${name}(d,p){if(${invalid("d")})${
        throwError(message, type)
      };return d}`,
    );
    return;
  }

  const schemaType = typeof schema;
  if (
    schemaType === "string" || schemaType === "number" ||
    schemaType === "boolean"
  ) {
    schemaToIdx.set(schema, idx);
    const type = JSON.stringify(schema);
    const message = `It must be a ${type}.`;
    fns.push(
      `function ${name}(d,p){if(d!==${type})${
        throwError(message, type)
      };return d}`,
    );
    return;
  }
  if (schemaType === "bigint") {
    schemaToIdx.set(schema, idx);
    const type = `${schema!.toString()}n`;
    const message = `It must be a ${type}.`;
    fns.push(
      `function ${name}(d,p){if(d!==${type})${
        throwError(message, type)
      };return d}`,
    );
    return;
  }

  schemaToIdx.set(schema, idx);
  fns.push("");

  let result = `function ${name}(d,p){`; // start fn
  if (Array.isArray(schema)) {
    if (schema[0] === "or") {
      const [_, children] = schema;
      if (children.length === 0) {
        throw new Error("Empty or");
      }
      for (const child of children) {
        const template = primitiveTemplates.get(child);
        if (template) {
          const [valid] = template;
          result += `if(${valid("d")})return d;`;
        } else {
          if (!schemaToIdx.has(child)) {
            traverse(child);
          }
          const idx = schemaToIdx.get(child)!;
          result += `try{return _${idx}(d,p)}catch{}`;
        }
      }
      result += throwError("It must be one of the types.", "or");
    } else if (Array.isArray(schema) && schema[0] === "array") {
      const [_, of] = schema;
      result += `if(!Array.isArray(d))${
        throwError("It must be a array.", "array")
      };`;
      result += `for(let i=0;i<d.length;i++){`;
      const template = primitiveTemplates.get(of);
      const nextPath = 'p+"["+i+"]"';
      if (template) {
        const [_, invalid, type] = template;
        const message = `It must be a ${type}.`;
        result += `if(${invalid("d[i]")})${
          throwError(message, type, nextPath)
        };`;
      } else {
        if (!schemaToIdx.has(of)) {
          traverse(of);
        }
        const idx = schemaToIdx.get(of)!;
        result += `d[i]=_${idx}(d[i],${nextPath});`;
      }
      result += `}`;
      result += `return d`;
    } else if (Array.isArray(schema) && schema[0] === "decorate") {
      const [_, of, decorators] = schema;
      if (!schemaToIdx.has(of)) {
        traverse(of);
      }
      const idx = schemaToIdx.get(of)!;
      result += `d=_${idx}(d,p);`;
      for (const decorator of decorators) {
        if (decorator.validate) {
          result += `if(!${decorator.validate("d")})${
            throwError(
              "This is an invalid value from decorator.",
              `#${decorator.name}`,
            )
          };`;
        }
        if (decorator.sanitize) {
          result += `d=${decorator.sanitize("d")};`;
        }
      }
      result += `return d`;
    }
  } else if (typeof schema === "object" && schema !== null) {
    const type = "object";
    const message = `It must be a ${type}.`;
    result += `if(typeof d!=="object"||d===null)${throwError(message, type)};`;
    const entries = Object.entries(schema);
    for (const [key, child] of entries) {
      const nextValue = `d[${JSON.stringify(key)}]`;
      const nextPath = `p+${JSON.stringify("." + key)}`;
      const template = primitiveTemplates.get(child);
      if (template) {
        const [_, invalid, type] = template;
        const message = `It must be a ${type}.`;
        result += `if(${invalid(nextValue)})${
          throwError(message, type, nextPath)
        };`;
      } else {
        if (!schemaToIdx.has(child)) {
          traverse(child);
        }
        const idx = schemaToIdx.get(child)!;
        result += `${nextValue}=_${idx}(${nextValue},${nextPath});`;
      }
    }
    result += `return d`;
  } else {
    throw new Error("Invalid schema");
  }
  result += `}`; // end fn

  fns[idx] = result;
}

export function createSanitizeSource(schema: Schema) {
  fns = [];
  schemaToIdx.clear();
  traverse(schema);
  return fns.join("\n");
}

function mapCreateError(message: string, reason: string, path: string) {
  return new InvalidValueError(message, reason, path.replace(/^\.+/, ""));
}

export function createSanitize<T extends Schema>(
  schema: T,
): (data: unknown) => ParseSchema<T> {
  return new Function(
    "error",
    `${createSanitizeSource(schema)}\nreturn function(d){return _0(d,'')}`,
  )(mapCreateError);
}

import { Decorator } from "../decorator/decorator.ts";
import { ParseSchema } from "../schema/parse_schema.ts";
import { Kind, Schema } from "../schema/schema.ts";
import { primitiveTemplates } from "./template.ts";

const schemaToIdx = new Map<unknown, number>();
let fns: string[] = [];
const decoratorToIdx = new Map<Decorator<unknown>, number>();
let _d: Decorator<unknown>[] = [];

function traverse(schema: Schema) {
  const idx = fns.length;
  const name = `_${idx}`;

  const template = primitiveTemplates.get(schema);
  if (template) {
    schemaToIdx.set(schema, idx);
    fns.push(`function ${name}(d){return ${template[0]("d")}}`);
    return;
  }

  const schemaType = typeof schema;
  if (
    schemaType === "string" || schemaType === "number" ||
    schemaType === "boolean"
  ) {
    schemaToIdx.set(schema, idx);
    fns.push(`function ${name}(d){return d===${JSON.stringify(schema)}}`);
    return;
  }
  if (schemaType === "bigint") {
    schemaToIdx.set(schema, idx);
    fns.push(`function ${name}(d){return d===${schema!.toString()}n}`);
    return;
  }

  schemaToIdx.set(schema, idx);
  fns.push("");

  let result = `function ${name}(d){`; // start fn
  if (Array.isArray(schema)) {
    switch (schema[0]) {
      case Kind.Union: {
        const [_, children] = schema;
        if (children.length === 0) {
          throw new Error("Empty or");
        }
        result += `return `;
        result += children.map((child) => {
          const template = primitiveTemplates.get(child);
          if (template) {
            return template[0]("d");
          }
          if (!schemaToIdx.has(child)) {
            traverse(child);
          }
          const idx = schemaToIdx.get(child)!;
          return `_${idx}(d)`;
        }).join("||");
        break;
      }
      case Kind.Array: {
        const [_, of] = schema;
        result += `if(!Array.isArray(d)) return false;`;
        result += `for(let i=0;i<d.length;i++){`;
        const template = primitiveTemplates.get(of);
        if (template) {
          result += `if (${template[1]("d[i]")}) return false;`;
        } else {
          if (!schemaToIdx.has(of)) {
            traverse(of);
          }
          const idx = schemaToIdx.get(of)!;
          result += `if (!_${idx}(d[i])) return false;`;
        }
        result += `}`;
        result += `return true`;
        break;
      }
      case Kind.Decorator: {
        const [_, of, decorators] = schema;
        if (!schemaToIdx.has(of)) {
          traverse(of);
        }
        const idx = schemaToIdx.get(of)!;
        result += `if (!_${idx}(d)) return false;`;
        for (const decorator of decorators) {
          if (!decoratorToIdx.has(decorator)) {
            decoratorToIdx.set(decorator, _d.length);
            _d.push(decorator);
          }
          const decoratorId = decoratorToIdx.get(decorator)!;
          if (decorator.validate) {
            result += `if(!_d[${decoratorId}].validate(d))return false;`;
          }
        }
        result += `return true`;
        break;
      }
      case Kind.Any: {
        result += `return true`;
        break;
      }
    }
  } else if (typeof schema === "object" && schema !== null) {
    const entries = Object.entries(schema);
    if (entries.length === 0) {
      result += `return typeof d === "object" && d !== null;`;
    } else {
      result += `if(typeof d !== "object" || d === null) return false;`;
      result += `return `;
      result += entries.map(([key, nextSchema]) => {
        const nextKey = `d[${JSON.stringify(key)}]`;
        const template = primitiveTemplates.get(nextSchema);
        if (template) {
          return template[0](nextKey);
        }
        if (!schemaToIdx.has(nextSchema)) {
          traverse(nextSchema);
        }
        const idx = schemaToIdx.get(nextSchema)!;
        return `_${idx}(${nextKey})`;
      }).join("&&");
    }
  } else {
    throw new Error("Invalid schema");
  }
  result += `}`; // end fn

  fns[idx] = result;
}

export function createValidateSource(schema: Schema) {
  fns = [];
  _d = [];
  schemaToIdx.clear();
  decoratorToIdx.clear();
  traverse(schema);
  return fns.join("\n");
}

export function createValidate<T extends Schema>(
  schema: T,
): (data: unknown) => data is ParseSchema<T> {
  return new Function(
    "_d",
    `${createValidateSource(schema)}\nreturn _0`,
  )(_d);
}

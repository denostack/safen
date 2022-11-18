import { ParseSchema } from "../schema/parse_schema.ts";
import { Schema } from "../schema/schema.ts";

const schemaToIdx = new Map<unknown, number>();
let fns: string[] = [];

const scalarTemplates = new Map<
  unknown,
  [valid: (value: string) => string, invalid: (value: string) => string]
>([
  [String, [
    (v) => `typeof ${v} === "string"`,
    (v) => `typeof ${v} !== "string"`,
  ]],
  [Number, [
    (v) => `typeof ${v} === "number"`,
    (v) => `typeof ${v} !== "number"`,
  ]],
  [Boolean, [
    (v) => `typeof ${v} === "boolean"`,
    (v) => `typeof ${v} !== "boolean"`,
  ]],
  [BigInt, [
    (v) => `typeof ${v} === "bigint"`,
    (v) => `typeof ${v} !== "bigint"`,
  ]],
  [Array, [
    (v) => `Array.isArray(${v})`,
    (v) => `!Array.isArray(${v})`,
  ]],
  [null, [(v) => `${v} === null`, (v) => `${v} !== null`]],
  [undefined, [
    (v) => `typeof ${v} === "undefined"`,
    (v) => `typeof ${v} !== "undefined"`,
  ]],
]);

function traverse(schema: Schema) {
  const idx = fns.length;
  const name = `_${idx}`;

  const template = scalarTemplates.get(schema);
  if (template) {
    schemaToIdx.set(schema, idx);
    fns.push(`function ${name}(d){return ${template[0]("d")}}`);
    return;
  }

  const type = typeof schema;
  if (
    type === "string" || type === "number" || type === "boolean"
  ) {
    schemaToIdx.set(schema, idx);
    fns.push(`function ${name}(d){return d===${JSON.stringify(schema)}}`);
    return;
  }
  if (type === "bigint") {
    schemaToIdx.set(schema, idx);
    fns.push(`function ${name}(d){return d===${schema!.toString()}n}`);
    return;
  }

  schemaToIdx.set(schema, idx);
  fns.push("");

  let result = `function ${name}(d){`; // start fn
  if (Array.isArray(schema)) {
    if (schema[0] === "or") {
      const [_, children] = schema;
      if (children.length === 0) {
        result += `return false`;
      }
      result += `return `;
      result += children.map((child) => {
        const template = scalarTemplates.get(child);
        if (template) {
          return template[0]("d");
        }
        if (!schemaToIdx.has(child)) {
          traverse(child);
        }
        const idx = schemaToIdx.get(child)!;
        return `_${idx}(d)`;
      }).join("||");
    } else if (Array.isArray(schema) && schema[0] === "array") {
      const [_, of] = schema;
      result += `if(!Array.isArray(d)) return false;`;
      result += `for(let i=0;i<d.length;i++){`;
      const template = scalarTemplates.get(of);
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
    } else if (Array.isArray(schema) && schema[0] === "decorate") {
      const [_, of, decorators] = schema;
      if (!schemaToIdx.has(of)) {
        traverse(of);
      }
      const idx = schemaToIdx.get(of)!;
      result += `if (!_${idx}(d)) return false;`;
      for (const decorator of decorators) {
        if (decorator.validate) {
          result += `if (!${decorator.validate("d")}) return false;`;
        }
      }
      result += `return true`;
    }
  } else if (typeof schema === "object" && schema !== null) {
    const entries = Object.entries(schema);
    if (entries.length === 0) {
      result += `return typeof d === "object" && d !== null;`;
    } else {
      result += `if(typeof d !== "object" || d === null) return false;`;
      result += `return `;
      result += entries.map(([key, nextSchema]) => {
        const template = scalarTemplates.get(nextSchema);
        if (template) {
          return template[0](`d.${key}`);
        }
        if (!schemaToIdx.has(nextSchema)) {
          traverse(nextSchema);
        }
        const idx = schemaToIdx.get(nextSchema)!;
        return `_${idx}(d.${key})`;
      }).join("&&");
    }
  } else {
    result += `return false`;
  }
  result += `}`; // end fn

  fns[idx] = result;
}

export function createValidateSource(schema: Schema) {
  fns = [];
  schemaToIdx.clear();
  traverse(schema);
  return fns.join("\n");
}

export function createValidate<T extends Schema>(
  schema: T,
): (data: unknown) => data is ParseSchema<T> {
  return new Function(
    `${createValidateSource(schema)}\nreturn _0`,
  )();
}

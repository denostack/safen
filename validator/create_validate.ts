import { ParseSchema } from "../schema/parse_schema.ts";
import { Schema } from "../schema/schema.ts";

const schemaToIdx = new Map<unknown, number>();
let fns: string[] = [];

const scalarTemplates = new Map<unknown, (value: string) => string>([
  [String, (v) => `typeof ${v} === "string"`],
  [Number, (v) => `typeof ${v} === "number"`],
  [Boolean, (v) => `typeof ${v} === "boolean"`],
  [BigInt, (v) => `typeof ${v} === "bigint"`],
  [null, (v) => `${v} === null`],
  [undefined, (v) => `typeof ${v} === "undefined"`],
]);

function traverse(schema: unknown) {
  const idx = fns.length;
  const name = `_${idx}`;

  schemaToIdx.set(schema, idx);
  fns.push("");

  let result = `function ${name}(d){`; // start fn
  const template = scalarTemplates.get(schema);
  if (template) {
    result += `return ${template("d")}`;
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
          return template(`d.${key}`);
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

export function createValidate<T extends Schema>(
  schema: T,
): (data: unknown) => data is ParseSchema<T> {
  fns = [];
  schemaToIdx.clear();

  traverse(schema);

  return new Function(
    `${fns.join("\n")}\nreturn _0`,
  )();
}

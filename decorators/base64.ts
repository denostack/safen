import { SchemaDecorator } from "../schema/schema.ts";

export function base64(): SchemaDecorator<string> {
  return {
    name: "base64",
    validate: (v) =>
      "(function(){" +
      `var l=${v}.length;` +
      `if(!l||l%4!==0|| /[^A-Z0-9+\\/=]/i.test(${v})){return false}` +
      `var f=${v}.indexOf('=');` +
      `return f===-1||f===l-1||(f===l-2&&${v}[l- 1]==='=')` +
      "})()",
  };
}

import { SchemaDecorator } from "../schema/schema.ts";

export function json(): SchemaDecorator<string> {
  return {
    name: `json`,
    validate: (v) =>
      `(function(){try{JSON.parse(${v});return true}catch(e){}return false})()`,
  };
}

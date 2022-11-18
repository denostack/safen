import { SafenDecorator } from "../schema/schema.ts";

export function json(): SafenDecorator<string> {
  return {
    name: `json`,
    validate: (v) =>
      `(function(){try{JSON.parse(${v});return true}catch(e){}return false})()`,
  };
}

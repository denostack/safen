import { SchemaDecorator } from "../schema/schema.ts";

export function macaddress(): SchemaDecorator<string> {
  return {
    name: "macaddress",
    validate: (v) =>
      `/^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/.test(${v})`,
  };
}

import { SafenDecorator } from "../schema/schema.ts";

export function macaddress(): SafenDecorator<string> {
  return {
    name: "macaddress",
    validate: (v) =>
      `/^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/.test(${v})`,
  };
}

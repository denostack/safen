import { SafenDecorator } from "../schema/schema.ts";

export function email(): SafenDecorator<string> {
  return {
    name: "email",
    validate: (v) =>
      `/^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/.test(${v})`,
  };
}

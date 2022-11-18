import { SafenDecorator } from "../schema/schema.ts";

export function url(): SafenDecorator<string> {
  return {
    name: "url",
    validate: (v) =>
      `/^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$/.test(${v})`,
  };
}

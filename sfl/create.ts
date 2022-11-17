import { messages as defaultMessages } from "../constants/messages.ts";
import { testers as defaultTesters } from "../constants/testers.ts";
import { MessageMap, TesterMap } from "../interfaces/common.ts";
import { Validator } from "../validator/validator.ts";
import { parse } from "./parse.ts";

export interface CreateOptions {
  testers?: TesterMap;
  messages?: MessageMap;
}

export function create<T = any>(
  rule: string,
  { testers, messages }: CreateOptions = {},
): Validator<T> {
  return new Validator<T>(
    parse(rule),
    Object.assign({}, defaultTesters, testers),
    Object.assign({}, defaultMessages, messages),
  );
}

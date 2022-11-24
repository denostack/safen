import { generateRandomUser } from "./stubs/user.ts";
import * as zod from "./stubs/validate_zod.ts";
import * as safen from "./stubs/validate_safen.ts";
import * as typebox from "./stubs/validate_typebox.ts";

const user = generateRandomUser();

Deno.bench({
  name: "Safen Object",
  group: "validate",
  ignore: !safen.isUser(user),
  baseline: true,
}, () => {
  safen.isUser(user);
});

Deno.bench({
  name: "Safen(& Generate) Object",
  group: "validate",
  ignore: !safen.generateAndIsUser(user),
}, () => {
  safen.generateAndIsUser(user);
});

Deno.bench({
  name: "Zod Object",
  group: "validate",
  ignore: !zod.isUser(user),
}, () => {
  zod.isUser(user);
});

Deno.bench({
  name: "TypeBox Object",
  group: "validate",
  ignore: !typebox.isUser(user),
}, () => {
  typebox.isUser(user);
});

Deno.bench({
  name: "TypeBox(& Generate) Object",
  group: "validate",
  ignore: !typebox.generateAndIsUser(user),
}, () => {
  typebox.generateAndIsUser(user);
});

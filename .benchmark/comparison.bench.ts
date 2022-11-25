import { generateRandomUser } from "./stubs/user.ts";
import * as zod from "./stubs/validate_zod.ts";
import * as safen from "./stubs/validate_safen.ts";
import * as typebox from "./stubs/validate_typebox.ts";
import * as ajv from "./stubs/validate_ajv.ts";

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
  name: "Safen(w/ Validate Creation) Object",
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
  name: "Ajv Object",
  group: "validate",
  ignore: !ajv.isUser(user),
}, () => {
  ajv.isUser(user);
});

Deno.bench({
  name: "Ajv(w/ Validate Creation) Object",
  group: "validate",
  ignore: !ajv.generateAndIsUser(user),
}, () => {
  ajv.generateAndIsUser(user);
});

Deno.bench({
  name: "TypeBox Object",
  group: "validate",
  ignore: !typebox.isUser(user),
}, () => {
  typebox.isUser(user);
});

Deno.bench({
  name: "TypeBox(w/ Validate Creation) Object",
  group: "validate",
  ignore: !typebox.generateAndIsUser(user),
}, () => {
  typebox.generateAndIsUser(user);
});

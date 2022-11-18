import { array, or } from "../mod.ts";
import { z } from "https://deno.land/x/zod@v3.16.1/mod.ts";
import { Static, Type } from "npm:@sinclair/typebox";
import { TypeCompiler } from "npm:@sinclair/typebox/compiler";

import { generateRandomUser } from "./stubs/user.ts";
import { createValidate } from "../validator/create_validate.ts";

const isSafenUser = (() => {
  const DateType = {
    timestamp: Number,
    offset: Number,
  };

  const CommentType = {
    id: or([Number, String]),
    contents: String,
    createdAt: DateType,
  };

  const ArticleType = {
    id: or([Number, String]),
    title: String,
    content: String,
    comments: array(CommentType),
    updatedAt: DateType,
    createdAt: DateType,
  };

  const UserType = {
    id: or([Number, String]),
    email: String,
    name: String,
    articles: array(ArticleType),
    comments: array(CommentType),
    location: String,
    createdAt: DateType,
  };

  const v = createValidate(UserType);
  return (user: unknown) => {
    return v(user);
  };
})();

const isZodUser = (() => {
  const DateType = z.object({
    timestamp: z.number().int(),
    offset: z.number().int(),
  });

  const CommentType = z.object({
    id: z.number().int().or(z.string()),
    contents: z.string(),
    createdAt: DateType,
  });

  const ArticleType = z.object({
    id: z.number().int().or(z.string()),
    title: z.string(),
    content: z.string(),
    comments: z.array(CommentType),
    updatedAt: DateType,
    createdAt: DateType,
  });

  const UserType = z.object({
    id: z.number().int().or(z.string()),
    email: z.string(),
    name: z.string(),
    articles: z.array(ArticleType),
    comments: z.array(CommentType),
    location: z.string(),
    createdAt: DateType,
  });

  return (input: unknown) => UserType.safeParse(input).success;
})();

const isTypeBoxUser = (() => {
  const DateType = Type.Object({
    timestamp: Type.Integer(),
    offset: Type.Integer(),
  });

  const CommentType = Type.Object({
    id: Type.Union([Type.Integer(), Type.String()]),
    contents: Type.String(),
    createdAt: DateType,
  });

  const ArticleType = Type.Object({
    id: Type.Union([Type.Integer(), Type.String()]),
    title: Type.String(),
    content: Type.String(),
    comments: Type.Array(CommentType),
    updatedAt: DateType,
    createdAt: DateType,
  });

  const UserType = Type.Object({
    id: Type.Union([Type.Integer(), Type.String()]),
    email: Type.String(), // email?
    name: Type.String(),
    articles: Type.Array(ArticleType),
    comments: Type.Array(CommentType),
    location: Type.String(),
    createdAt: DateType,
  });

  const compiled = TypeCompiler.Compile(UserType);
  return (input: unknown) => compiled.Check(input);
})();

const user = generateRandomUser();

console.log("Safen", isSafenUser(user));
Deno.bench({
  name: "Safen Object",
  group: "object",
  baseline: true,
}, () => {
  isSafenUser(user);
});

console.log("Zod", isZodUser(user));
Deno.bench({
  name: "Zod Object",
  group: "object",
}, () => {
  isZodUser(user);
});

console.log("TypeBox", isTypeBoxUser(user));
Deno.bench({
  name: "TypeBox Object",
  group: "object",
}, () => {
  isTypeBoxUser(user);
});

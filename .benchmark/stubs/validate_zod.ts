import { z } from "https://deno.land/x/zod@v3.16.1/mod.ts";

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

export function isUser(input: unknown) {
  return UserType.safeParse(input).success;
}

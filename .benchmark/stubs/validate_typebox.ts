import { Type } from "npm:@sinclair/typebox";
import { TypeCompiler } from "npm:@sinclair/typebox/compiler";

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
export function isUser(input: unknown) {
  return compiled.Check(input);
}

export function generateAndIsUser(input: unknown) {
  const compiled = TypeCompiler.Compile(UserType);
  return compiled.Check(input);
}

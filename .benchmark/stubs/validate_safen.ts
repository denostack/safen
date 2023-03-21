import { v } from "../../mod.ts";

const DateType = {
  timestamp: Number,
  offset: Number,
};

const CommentType = {
  id: v.union([Number, String]),
  contents: String,
  createdAt: DateType,
};

const ArticleType = {
  id: v.union([Number, String]),
  title: String,
  content: String,
  comments: v.array(CommentType),
  updatedAt: DateType,
  createdAt: DateType,
};

const UserType = {
  id: v.union([Number, String]),
  email: v.decorate(String, (d) => d.email()),
  name: String,
  articles: v.array(ArticleType),
  comments: v.array(CommentType),
  location: String,
  createdAt: DateType,
};

const validate = v(UserType);
export function isUser(user: unknown) {
  return validate(user);
}

export function generateAndIsUser(user: unknown) {
  return v(UserType)(user);
}

import { array, createValidate, decorate, email, or } from "../../mod.ts";

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
  email: decorate(String, email()),
  name: String,
  articles: array(ArticleType),
  comments: array(CommentType),
  location: String,
  createdAt: DateType,
};

const v = createValidate(UserType);
export function isUser(user: unknown) {
  return v(user);
}

export function generateAndIsUser(user: unknown) {
  return createValidate(UserType)(user);
}

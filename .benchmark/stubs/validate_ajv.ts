import Ajv from "https://esm.sh/ajv@8";

const DateType = {
  type: "object",
  properties: {
    timestamp: { type: "integer" },
    offset: { type: "integer" },
  },
  required: ["timestamp", "offset"],
};

const CommentType = {
  type: "object",
  properties: {
    id: {
      anyOf: [
        { type: "integer" },
        { type: "string" },
      ],
    },
    contents: { type: "string" },
    createdAt: DateType,
  },
  required: ["id", "contents", "createdAt"],
};

const ArticleType = {
  type: "object",
  properties: {
    id: { type: "integer" },
    title: { type: "string" },
    content: { type: "string" },
    comments: {
      type: "array",
      items: CommentType,
    },
    updatedAt: DateType,
    createdAt: DateType,
  },
  required: ["id", "title", "content", "comments", "updatedAt", "createdAt"],
};

const UserType = {
  type: "object",
  properties: {
    id: {
      anyOf: [
        { type: "integer" },
        { type: "string" },
      ],
    },
    email: { type: "string" },
    name: { type: "string" },
    articles: {
      type: "array",
      items: ArticleType,
    },
    comments: {
      type: "array",
      items: CommentType,
    },
    location: { type: "string" },
    createdAt: DateType,
  },
  required: [
    "id",
    "email",
    "name",
    "articles",
    "comments",
    "location",
    "createdAt",
  ],
};

const ajv1 = new Ajv();
const validate = ajv1.compile(UserType);
export function isUser(input: unknown) {
  return validate(input);
}

const ajv2 = new Ajv();
export function generateAndIsUser(input: unknown) {
  ajv2.removeSchema(); // clear cache
  const validate = ajv2.compile(UserType);
  return validate(input);
}

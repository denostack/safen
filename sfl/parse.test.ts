import { assertEquals, assertThrows } from "testing/asserts.ts";
import { parse } from "./parse.ts";
import { SyntaxError } from "../errors/syntax-error.ts";

Deno.test("sfl/parse, scalar success", () => {
  assertEquals(parse("string"), {
    type: "scalar",
    name: "string",
    params: [],
  });

  assertEquals(parse("email"), {
    type: "scalar",
    name: "email",
    params: [],
  });

  assertEquals(parse("email()"), {
    type: "scalar",
    name: "email",
    params: [],
  });

  assertEquals(parse("email(true)"), {
    type: "scalar",
    name: "email",
    params: [true],
  });

  assertEquals(parse("email(true,)"), {
    type: "scalar",
    name: "email",
    params: [true],
  });

  assertEquals(
    parse(
      "email(true, false, null, \"string\", 'string', \"line\\\"\", 'line\\'', 3.14, -500.5, /abc/, /ab\\/c/igm, /^(010\\d{8})|(01[16789]\\d{7,8})$/,)",
    ),
    {
      type: "scalar",
      name: "email",
      params: [
        true,
        false,
        null,
        "string",
        "string",
        'line"',
        "line'",
        3.14,
        -500.5,
        /abc/,
        /ab\/c/gim,
        /^(010\d{8})|(01[16789]\d{7,8})$/,
      ],
    },
  );

  assertEquals(
    parse(`
      string
    `),
    {
      type: "scalar",
      name: "string",
      params: [],
    },
  );

  assertEquals(
    parse(`
      email
    `),
    {
      type: "scalar",
      name: "email",
      params: [],
    },
  );
});

Deno.test("sfl/parse, scalar fail", () => {
  assertThrows(
    () => parse("?string"),
    SyntaxError,
    `Syntax Error: expected tester, unexpected token "?" (1:1)
1: ?string
   ^`,
  );
  assertThrows(
    () => parse("str?ing"),
    SyntaxError,
    `Syntax Error: expected EOF, unexpected token "?" (1:4)
1: str?ing
      ^`,
  );

  assertThrows(
    () =>
      parse(`
    ?string
  `),
    SyntaxError,
    `Syntax Error: expected tester, unexpected token "?" (2:5)
2:     ?string
       ^`,
  );

  assertThrows(
    () => parse("email(,)"),
    SyntaxError,
    `Syntax Error: expected tester param, unexpected token "," (1:7)
1: email(,)
         ^`,
  );

  assertThrows(
    () => parse("email(true,,)"),
    SyntaxError,
    `Syntax Error: expected tester param, unexpected token "," (1:12)
1: email(true,,)
              ^`,
  );
});

Deno.test("sfl/parse, expression success", () => {
  assertEquals(parse("string | email | something"), {
    type: "or",
    params: [
      { type: "scalar", name: "string", params: [] },
      { type: "scalar", name: "email", params: [] },
      { type: "scalar", name: "something", params: [] },
    ],
  });

  assertEquals(parse("string & email & something"), {
    type: "and",
    params: [
      { type: "scalar", name: "string", params: [] },
      { type: "scalar", name: "email", params: [] },
      { type: "scalar", name: "something", params: [] },
    ],
  });

  assertEquals(parse("string & email | string & phone"), {
    type: "or",
    params: [
      {
        type: "and",
        params: [
          { type: "scalar", name: "string", params: [] },
          { type: "scalar", name: "email", params: [] },
        ],
      },
      {
        type: "and",
        params: [
          { type: "scalar", name: "string", params: [] },
          { type: "scalar", name: "phone", params: [] },
        ],
      },
    ],
  });

  assertEquals(parse("string | string & email | phone"), {
    type: "or",
    params: [
      { type: "scalar", name: "string", params: [] },
      {
        type: "and",
        params: [
          { type: "scalar", name: "string", params: [] },
          { type: "scalar", name: "email", params: [] },
        ],
      },
      { type: "scalar", name: "phone", params: [] },
    ],
  });

  assertEquals(parse("(string | email) & (string | phone)"), {
    type: "and",
    params: [
      {
        type: "or",
        params: [
          { type: "scalar", name: "string", params: [] },
          { type: "scalar", name: "email", params: [] },
        ],
      },
      {
        type: "or",
        params: [
          { type: "scalar", name: "string", params: [] },
          { type: "scalar", name: "phone", params: [] },
        ],
      },
    ],
  });
});

Deno.test("sfl/parse, object success", () => {
  assertEquals(parse("{}"), { type: "object", properties: {} });
  assertEquals(parse(" { } "), { type: "object", properties: {} });

  assertEquals(
    parse(`{
    name: string,
    username: string & email
  }`),
    {
      type: "object",
      properties: {
        name: {
          optional: false,
          value: { type: "scalar", name: "string", params: [] },
        },
        username: {
          optional: false,
          value: {
            type: "and",
            params: [
              { type: "scalar", name: "string", params: [] },
              { type: "scalar", name: "email", params: [] },
            ],
          },
        },
      },
    },
  );

  assertEquals(
    parse(`{
    name?: string,
    username: string & email
  }`),
    {
      type: "object",
      properties: {
        name: {
          optional: true,
          value: { type: "scalar", name: "string", params: [] },
        },
        username: {
          optional: false,
          value: {
            type: "and",
            params: [
              { type: "scalar", name: "string", params: [] },
              { type: "scalar", name: "email", params: [] },
            ],
          },
        },
      },
    },
  );

  assertEquals(
    parse(`{
    name?: string,
    username?: (string & email) | null,
  }`),
    {
      type: "object",
      properties: {
        name: {
          optional: true,
          value: { type: "scalar", name: "string", params: [] },
        },
        username: {
          optional: true,
          value: {
            type: "or",
            params: [
              {
                type: "and",
                params: [
                  { type: "scalar", name: "string", params: [] },
                  { type: "scalar", name: "email", params: [] },
                ],
              },
              { type: "scalar", name: "null", params: [] },
            ],
          },
        },
      },
    },
  );

  assertEquals(
    parse(`{
    name: string,
    username: string & email & in("abc", "def", 10, 20)
  } | null`),
    {
      type: "or",
      params: [
        {
          type: "object",
          properties: {
            name: {
              optional: false,
              value: { type: "scalar", name: "string", params: [] },
            },
            username: {
              optional: false,
              value: {
                type: "and",
                params: [
                  { type: "scalar", name: "string", params: [] },
                  { type: "scalar", name: "email", params: [] },
                  {
                    type: "scalar",
                    name: "in",
                    params: ["abc", "def", 10, 20],
                  },
                ],
              },
            },
          },
        },
        { type: "scalar", name: "null", params: [] },
      ],
    },
  );
});

Deno.test("sfl/parse, array success", () => {
  assertEquals(parse("string[]"), {
    type: "array",
    value: { type: "scalar", name: "string", params: [] },
  });
  assertEquals(parse("string[1]"), {
    type: "array",
    min: 1,
    max: 1,
    value: { type: "scalar", name: "string", params: [] },
  });
  assertEquals(parse("string[1:]"), {
    type: "array",
    min: 1,
    value: { type: "scalar", name: "string", params: [] },
  });
  assertEquals(parse("string[:2]"), {
    type: "array",
    max: 2,
    value: { type: "scalar", name: "string", params: [] },
  });
  assertEquals(parse("string[1:2]"), {
    type: "array",
    min: 1,
    max: 2,
    value: { type: "scalar", name: "string", params: [] },
  });

  assertEquals(parse("string[][]"), {
    type: "array",
    value: {
      type: "array",
      value: { type: "scalar", name: "string", params: [] },
    },
  });
  assertEquals(parse("string[ 1 ][]"), {
    type: "array",
    value: {
      type: "array",
      min: 1,
      max: 1,
      value: { type: "scalar", name: "string", params: [] },
    },
  });
  assertEquals(parse("string[ 1 : ][]"), {
    type: "array",
    value: {
      type: "array",
      min: 1,
      value: { type: "scalar", name: "string", params: [] },
    },
  });
  assertEquals(parse("string[ : 2 ][]"), {
    type: "array",
    value: {
      type: "array",
      max: 2,
      value: { type: "scalar", name: "string", params: [] },
    },
  });
  assertEquals(parse("string[ 1 : 2 ][]"), {
    type: "array",
    value: {
      type: "array",
      min: 1,
      max: 2,
      value: { type: "scalar", name: "string", params: [] },
    },
  });

  assertEquals(
    parse(`{
    name: string,
    username: string & email & in("abc", "def", 10, 20)
  }[]`),
    {
      type: "array",
      value: {
        type: "object",
        properties: {
          name: {
            optional: false,
            value: { type: "scalar", name: "string", params: [] },
          },
          username: {
            optional: false,
            value: {
              type: "and",
              params: [
                { type: "scalar", name: "string", params: [] },
                { type: "scalar", name: "email", params: [] },
                { type: "scalar", name: "in", params: ["abc", "def", 10, 20] },
              ],
            },
          },
        },
      },
    },
  );

  assertEquals(
    parse(`{
    name: string,
    username: string & email & in("abc", "def", 10, 20)
  }[] | null`),
    {
      type: "or",
      params: [
        {
          type: "array",
          value: {
            type: "object",
            properties: {
              name: {
                optional: false,
                value: { type: "scalar", name: "string", params: [] },
              },
              username: {
                optional: false,
                value: {
                  type: "and",
                  params: [
                    { type: "scalar", name: "string", params: [] },
                    { type: "scalar", name: "email", params: [] },
                    {
                      type: "scalar",
                      name: "in",
                      params: ["abc", "def", 10, 20],
                    },
                  ],
                },
              },
            },
          },
        },
        { type: "scalar", name: "null", params: [] },
      ],
    },
  );

  assertEquals(
    parse(`({
    name: string,
    username: string & email & in("abc", "def", 10, 20)
  } | null)[][5]`),
    {
      type: "array",
      min: 5,
      max: 5,
      value: {
        type: "array",
        value: {
          type: "or",
          params: [
            {
              type: "object",
              properties: {
                name: {
                  optional: false,
                  value: { type: "scalar", name: "string", params: [] },
                },
                username: {
                  optional: false,
                  value: {
                    type: "and",
                    params: [
                      { type: "scalar", name: "string", params: [] },
                      { type: "scalar", name: "email", params: [] },
                      {
                        type: "scalar",
                        name: "in",
                        params: ["abc", "def", 10, 20],
                      },
                    ],
                  },
                },
              },
            },
            { type: "scalar", name: "null", params: [] },
          ],
        },
      },
    },
  );

  assertEquals(
    parse(` ( ( ( ( {
    name     : string   ,
    username : ( string & email ) & in ( "abc" , "def" , 10 , 20 )
  } | null ) ) ) [ ] ) [ 5 ]`),
    {
      type: "array",
      min: 5,
      max: 5,
      value: {
        type: "array",
        value: {
          type: "or",
          params: [
            {
              type: "object",
              properties: {
                name: {
                  optional: false,
                  value: { type: "scalar", name: "string", params: [] },
                },
                username: {
                  optional: false,
                  value: {
                    type: "and",
                    params: [
                      {
                        type: "and",
                        params: [
                          { type: "scalar", name: "string", params: [] },
                          { type: "scalar", name: "email", params: [] },
                        ],
                      },
                      {
                        type: "scalar",
                        name: "in",
                        params: ["abc", "def", 10, 20],
                      },
                    ],
                  },
                },
              },
            },
            { type: "scalar", name: "null", params: [] },
          ],
        },
      },
    },
  );
});

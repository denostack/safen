# Safen

<p>
  <a href="https://github.com/denostack/safen/actions"><img alt="Build" src="https://img.shields.io/github/workflow/status/denostack/safen/CI?style=flat-square" /></a>
  <a href="https://codecov.io/gh/denostack/safen"><img alt="Coverage" src="https://img.shields.io/codecov/c/gh/denostack/safen?style=flat-square" /></a>
  <a href="https://npmcharts.com/compare/safen?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/safen.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/safen"><img alt="Version" src="https://img.shields.io/npm/v/safen.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/safen"><img alt="License" src="https://img.shields.io/npm/l/safen.svg?style=flat-square" /></a>
  <img alt="Language Typescript" src="https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square" />
</p>

Super Fast Object Validator<br />for Javascript(& Typescript).

Safen supports the syntax similar to the type script interface. This makes it
easy to create validation rules.

- [How to use](#how-to-use)
  - [Setup](#setup)
  - [`validate` method](#validate-method)
  - [`assert` method](#assert-method)
- [Syntax](#syntax)
- [Custom Tester](#custom-tester)
- [Support Validators](#support-validators)
  - [Type Validations](#type-validations)
  - [Other Validations](#other-validations)
- [Comparison](#comparison)
  - [Compare with JSON Schema](#compare-with-json-schema)
  - [Compare with JOI](#compare-with-joi)

## Usage

https://user-images.githubusercontent.com/4086535/203831205-8b3481cb-bb8d-4f3c-9876-e41adb6855fd.mp4

**Deno**

```ts
import { createValidate, union } from "https://deno.land/x/safen/mod.ts";

const v = createValidate({
  id: Number,
  // rule..
});

const input = {} as unknown; // some unknown value

if (v(input)) {
  // :-)
}
```

**Node**

```bash
npm install safen
```

### Validate

validate returns boolean and assert throws Exception.

```ts
const v = createValidate({
  id: Number,
  name: String,
});
// v(data: unknown): data is { id: number, name: string }

const input = {} as unknown; // some unknown value

if (v(input)) {
  // safe input!
}
```

### Sanitize

```ts
const s = createSanitize({
  id: Number,
  name: decorate(String, trim()),
});
// s(data: unknown): { id: number, name: string }

s({ id: 10, name: "  wan2land     " }); // return { id: 10, name: "wan2land" }
s({ id: 10 }); // exception!
```

## Decorator

```ts
const s = createSanitize({
  name: decorate(
    union([
      decorate(String, trim()),
      null,
    ]),
    emptyToNull(),
  ),
});

s("   hello   "); // return "hello"
s("      "); // return null
s(null); // return null
```

| Decorator                 | Validate | Transform | Type               | Description                                                                         |
| ------------------------- | -------- | --------- | ------------------ | ----------------------------------------------------------------------------------- |
| `alpha`                   | ✅        |           | `string`           | contains only letters([a-zA-Z]).                                                    |
| `alphanum`                | ✅        |           | `string`           | contains only letters and numbers([a-zA-Z0-9])                                      |
| `ascii`                   | ✅        |           | `string`           | contains only ascii characters.                                                     |
| `base64`                  | ✅        |           | `string`           | Base64.                                                                             |
| `between(min, max)`       | ✅        |           | `string`, `number` | value is between `{min}` and `{max}`. (ex) `between("aaa","zzz")`, `between(1,100)` |
| `ceil`                    |          | ✅         | `number`           | Math.ceil. (ref. `floor`, `round`)                                                  |
| `creditcard`              | ✅        |           | `string`           | valid Credit Card number. cf. `0000-0000-0000-0000`                                 |
| `dateformat`              | ✅        |           | `string`           | valid Date string(RFC2822, ISO8601). cf. `2018-12-25`, `12/25/2018`, `Dec 25, 2018` |
| `email`                   | ✅        |           | `string`           | valid E-mail string.                                                                |
| `emptyToNull`             |          | ✅         | `string or null`   | empty string(`""`) to null                                                          |
| `floor`                   |          | ✅         | `number`           | Math.floor. (ref. `ceil`, `round`)                                                  |
| `hexcolor`                | ✅        |           | `string`           | valid Hex Color string. cf. `#ffffff`                                               |
| `ip(version = null)`      | ✅        |           | `string`           | valid UUID.<br />version is one of `null`(both, default), `v4`, and `v6`.           |
| `json`                    | ✅        |           | `string`           | valid JSON.                                                                         |
| `length(size)`            | ✅        |           | `string`, `any[]`  | length is `{size}`.                                                                 |
| `lengthBetween(min, max)` | ✅        |           | `string`, `any[]`  | length is between `{min}` and `{max}`.                                              |
| `lengthMax(max)`          | ✅        |           | `string`, `any[]`  | length is less than `{max}`.                                                        |
| `lengthMin(min)`          | ✅        |           | `string`, `any[]`  | length is greater than `{min}`.                                                     |
| `lowercase`               | ✅        |           | `string`           | lowercase.                                                                          |
| `macaddress`              | ✅        |           | `string`           | valid Mac Address.                                                                  |
| `max(max)`                | ✅        |           | `string`, `number` | value is less than `{min}`.                                                         |
| `min(min)`                | ✅        |           | `string`, `number` | value is greater than `{max}`.                                                      |
| `port`                    | ✅        |           | `number`           | valid PORT(0-65535).                                                                |
| `re`                      | ✅        |           | `string`           | match RegExp.                                                                       |
| `round`                   |          | ✅         | `number`           | Math.round. (ref. `ceil`, `floor`)                                                  |
| `stringify`               |          | ✅         | `string`           | cast to string                                                                      |
| `toLower`                 |          | ✅         | `string`           | change to lower case.                                                               |
| `toUpper`                 |          | ✅         | `string`           | change to upper case.                                                               |
| `trim`                    |          | ✅         | `string`           | trim.                                                                               |
| `uppercase`               | ✅        |           | `string`           | uppercase.                                                                          |
| `url`                     | ✅        |           | `string`           | valid URL.                                                                          |
| `uuid(version = null)`    | ✅        |           | `string`           | valid UUID.<br />version is one of `null`(default), `v3`, `v4`, and `v5`.           |

## Custom Decorator

TODO

## Comparison

Using another library? Safen is lot easier to use.

```ts
const typeLat = decorate(Number, between(-90, 90));
const typeLng = decorate(Number, between(-180, 180));

const s = createSanitize({
  username: optional(decorate(String, [
    trim(),
    email(),
    lengthBetween(12, 100),
  ])),
  password: decorate(String, lengthBetween(8, 20)),
  areas: array({
    lat: typeLat,
    lng: typeLng,
  }),
  env: {
    referer: decorate(String, url()),
    ip: decorate(String, ip("v4")),
    os: {
      name: union([
        "window" as const,
        "osx" as const,
        "android" as const,
        "iphone" as const,
      ]),
      version: String,
    },
    browser: {
      name: union([
        "chrome" as const,
        "firefox" as const,
        "edge" as const,
        "ie" as const,
      ]),
      version: String,
    },
  },
});
```

### Compare with JSON Schema

<p>
  <details>
    <summary>Show JSON Schema Source</summary>

```json
{
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "username",
    "areas",
    "env"
  ],
  "properties": {
    "username": {
      "type": ["string", "null"],
      "format": "email",
      "minLength": 12,
      "maxLength": 100
    },
    "password": {
      "type": "string",
      "minLength": 8,
      "maxLength": 20
    },
    "areas": {
      "type": ["array", "null"],
      "items": {
        "type": "object",
        "required": [
          "lat",
          "lng"
        ],
        "properties": {
          "lat": {
            "type": "integer",
            "minimum": -90,
            "maximum": 90
          },
          "lng": {
            "type": "integer",
            "minimum": -180,
            "maximum": 180
          }
        }
      }
    },
    "env": {
      "type": "object",
      "required": [
        "referer",
        "ip",
        "os",
        "browser"
      ],
      "properties": {
        "referer": {
          "type": "string",
          "format": "uri"
        },
        "ip": {
          "type": "string",
          "format": "ipv4"
        },
        "os": {
          "type": "object",
          "required": [
            "name",
            "version"
          ],
          "properties": {
            "name": {
              "type": "string",
              "enum": ["window", "osx", "android", "iphone"]
            },
            "version": {
              "type": "string",
              "pattern": "^(.*)$"
            }
          }
        },
        "browser": {
          "type": "object",
          "required": [
            "name",
            "version"
          ],
          "properties": {
            "name": {
              "type": "string",
              "enum": ["chrome", "firefox", "edge", "ie"]
            },
            "version": {
              "type": "string",
              "pattern": "^(.*)$"
            }
          }
        }
      }
    }
  }
}
```

</details>
</p>

### Compare with JOI

[JOI](https://github.com/hapijs/joi) is the most popular object schema
validation library.

<p>
  <details>
    <summary>Show JOI Source</summary>

```js
Joi.object().keys({
  username: Joi.string().required().allow(null).email().min(12).max(100),
  password: Joi.string().min(8).max(20),
  areas: Joi.array().required().allow(null).min(1).items(
    Joi.object().keys({
      lat: Joi.number().required().min(-90).max(90),
      lng: Joi.number().required().min(-180).max(180),
    }),
  ),
  env: Joi.object().required().keys({
    referer: Joi.string().uri().required(),
    ip: Joi.string().required().ip({ version: ["ipv4"] }),
    os: Joi.object().required().keys({
      name: Joi.any().required().only("window", "osx", "android", "iphone"),
      version: Joi.string().required(),
    }),
    browser: Joi.object().required().keys({
      name: Joi.any().required().only("chrome", "firefox", "edge", "ie"),
      version: Joi.string().required(),
    }),
  }),
});
```

</details>
</p>

## Old Versions

- [1.x](https://github.com/denostack/safen/tree/1.x)
- [2.x](https://github.com/denostack/safen/tree/1.x)

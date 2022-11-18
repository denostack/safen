<p align="center">
  <img src="./safen.png" alt="safen" width="500" />
</p>

<p align="center">Super Fast Object Validator<br />for Javascript(& Typescript).</p>

<p align="center">
  <a href="https://github.com/wan2land/safen/actions?query=workflow%3A%22Node.js+CI%22"><img alt="Build" src="https://img.shields.io/github/workflow/status/wan2land/safen/Node.js%20CI?logo=github&style=flat-square" /></a>
  <a href="https://npmcharts.com/compare/safen?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/safen.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/safen"><img alt="Version" src="https://img.shields.io/npm/v/safen.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/safen"><img alt="License" src="https://img.shields.io/npm/l/safen.svg?style=flat-square" /></a>
</p>

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

## 1.x

Please check [this link](https://github.com/wan2land/safen/tree/1.x) for the 1.x
version of the README.

## How to use

### Setup

install,

```bash
npm install safen --save
```

import,

```js
import * as safen from "safen";
```

### Validate

TODO

### Sanitize

TODO

## Syntax

TODO

## Decorator

| Decorator                       | Validate | Sanitize | Type               | Description                                                                         | Example                                          |
| ------------------------------- | -------- | -------- | ------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------ |
| **alpha**                       | ✅        |          | `string`           | contains only letters([a-zA-Z]).                                                    | `alpha`                                          |
| **alphanum**                    | ✅        |          | `string`           | contains only letters and numbers([a-zA-Z0-9])                                      | `alphanum`                                       |
| **ascii**                       | ✅        |          | `string`           | contains only ascii characters.                                                     | `ascii`                                          |
| **base64**                      | ✅        |          | `string`           | Base64.                                                                             | `base64`                                         |
| **between({min},{max})**        | ✅        |          | `string`, `number` | value is between `{min}` and `{max}`.                                               | `between("aaa","zzz")`, `between(1,100)`         |
| **creditcard**                  | ✅        |          | `string`           | valid Credit Card number. cf. `0000-0000-0000-0000`                                 | `creditcard`                                     |
| **dateformat**                  | ✅        |          | `string`           | valid Date string(RFC2822, ISO8601). cf. `2018-12-25`, `12/25/2018`, `Dec 25, 2018` | `dateformat`                                     |
| **email**                       | ✅        |          | `string`           | valid E-mail string.                                                                | `email`                                          |
| **hexcolor**                    | ✅        |          | `string`           | valid Hex Color string. cf. `#ffffff`                                               | `hexcolor`                                       |
| **ip({version = all})**         | ✅        |          | `string`           | valid UUID.<br />version is one of `all`(default), `v4`, and `v6`.                  | `ip`, `ip("v4")`, `ip("v6")`                     |
| **json**                        | ✅        |          | `string`           | valid JSON.                                                                         | `json`                                           |
| **length({size})**              | ✅        |          | `string`, `any[]`  | length is `{size}`.                                                                 | `length(16)`                                     |
| **length_between({min},{max})** | ✅        |          | `string`, `any[]`  | length is between `{min}` and `{max}`.                                              | `length_between(4,20)`                           |
| **length_max({max})**           | ✅        |          | `string`, `any[]`  | length is less than `{max}`.                                                        | `length_max(20)`                                 |
| **length_min({min})**           | ✅        |          | `string`, `any[]`  | length is greater than `{min}`.                                                     | `length_min(4)`                                  |
| **lowercase**                   | ✅        |          | `string`           | lowercase.                                                                          | `lowercase`                                      |
| **macaddress**                  | ✅        |          | `string`           | valid Mac Address.                                                                  | `macaddress`                                     |
| **max({max})**                  | ✅        |          | `string`, `number` | value is less than {min}.                                                           | `max(5)`                                         |
| **min({min})**                  | ✅        |          | `string`, `number` | value is greater than {max}.                                                        | `min(3)`                                         |
| **port**                        | ✅        |          | `number`           | valid PORT(0-65535).                                                                | `port`                                           |
| **re**                          | ✅        |          | `string`           | match RegExp.                                                                       | `re(/.+/)`                                       |
| **trim**                        |          | ✅        | `string`           | trim.                                                                               | `trim`                                           |
| **uppercase**                   | ✅        |          | `string`           | uppercase.                                                                          | `uppercase`                                      |
| **url**                         | ✅        |          | `string`           | valid URL.                                                                          | `url`                                            |
| **uuid({version = all})**       | ✅        |          | `string`           | valid UUID.<br />version is one of `all`(default), `v3`, `v4`, and `v5`.            | `uuid`, `uuid("v3")`, `uuid("v4")`, `uuid("v5")` |

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
      name: or([
        "window" as const,
        "osx" as const,
        "android" as const,
        "iphone" as const,
      ]),
      version: String,
    },
    browser: {
      name: or([
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

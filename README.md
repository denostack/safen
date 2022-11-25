# Safen

<p>
  <a href="https://github.com/denostack/safen/actions"><img alt="Build" src="https://img.shields.io/github/workflow/status/denostack/safen/CI?style=flat-square" /></a>
  <a href="https://codecov.io/gh/denostack/safen"><img alt="Coverage" src="https://img.shields.io/codecov/c/gh/denostack/safen?style=flat-square" /></a>
  <a href="https://npmcharts.com/compare/safen?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/safen.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/safen"><img alt="Version" src="https://img.shields.io/npm/v/safen.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/safen"><img alt="License" src="https://img.shields.io/npm/l/safen.svg?style=flat-square" /></a>
  <img alt="Language Typescript" src="https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square" />
</p>

Super Fast Validator & Sanitizer Library for Typescript.

Safen supports the syntax similar to the type script interface. This makes it
easy to create validation rules.

https://user-images.githubusercontent.com/4086535/203831205-8b3481cb-bb8d-4f3c-9876-e41adb6855fd.mp4

## Installation

**Node**

```bash
npm install safen
```

**Deno**

```ts
import {
  createSanitize,
  createValidate,
} from "https://deno.land/x/safen/mod.ts";
```

## Basic Usage

**Create Validate Fn**

```ts
import { createValidate } from "https://deno.land/x/safen/mod.ts";

const validate = createValidate(String); // now, validate: (data: unknown) => data is string

const input = {} as unknown;
if (validate(input)) {
  // now input is string!
}
```

**Create Sanitize Fn**

```ts
import { createSanitize } from "https://deno.land/x/safen/mod.ts";

const sanitize = createSanitize(String); // now, sanitize: (data: unknown) => string

const input = {} as unknown; // some unknown value

sanitize("something" as unknown); // return "something"
sanitize(null as unknown); // throw InvalidValueError
```

## Types

```ts
// Primitive Types
const v = createValidate(String); // (data: unknown) => data is string
const v = createValidate(Number); // (data: unknown) => data is number
const v = createValidate(Boolean); // (data: unknown) => data is boolean
const v = createValidate(BigInt); // (data: unknown) => data is bigint
const v = createValidate(Symbol); // (data: unknown) => data is symbol

// Literal Types
const v = createValidate("foo"); // (data: unknown) => data is "foo"
const v = createValidate(1024); // (data: unknown) => data is 1024
const v = createValidate(true); // (data: unknown) => data is true
const v = createValidate(2048n); // (data: unknown) => data is 2048n
const v = createValidate(null); // (data: unknown) => data is null
const v = createValidate(undefined); // (data: unknown) => data is undefined

// Special
const v = createValidate(any()); // (data: unknown) => data is any
const v = createValidate(Array); // (data: unknown) => data is any[]

// Object
const Point = { x: Number, y: Number };
const v = createValidate({ p1: Point, p2: Point }); // (data: unknown) => data is { p1: { x: number, y: number }, p2: { x: number, y: number } }

// Union
const v = createValidate(union([String, Number])); // (data: unknown) => data is string | number

// Array
const v = createValidate([String]); // (data: unknown) => data is string[]
const v = createValidate([union([String, Number])]); // (data: unknown) => data is (string | number)[]
```

## Decorator

Decorators do not affect type inference, but do affect additional validation and
data transformation.

**Step1. Basic Sanitize**

```ts
const s = createSanitize(union([
  String,
  null,
]));

s("hello world!"); // return "hello world!"
s("  hello world!  "); // return "  hello world!  "
s("    "); // return "    "
s(null); // return null
```

**Step2. Add trim decorator**

```ts
const s = createSanitize(union([
  decorate(String, trim()),
  null,
]));

s("hello world!"); // return "hello world!"
s("  hello world!  "); // return "hello world!"
s("    "); // return ""
s(null); // return null
```

**Step3. Add emptyToNull decorator**

```ts
const s = createSanitize(
  decorate(
    union([
      decorate(String, trim()),
      null,
    ]),
    emptyToNull(),
  ),
);

s("hello world!"); // return "hello world!"
s("  hello world!  "); // return "hello world!"
s("    "); // return null
s(null); // return null
```

### Defined Decorators

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

## Benchmark

Please see [benchmark results](.benchmark).

## Old Version Docs

- [1.x](https://github.com/denostack/safen/tree/1.x)
- [2.x](https://github.com/denostack/safen/tree/1.x)

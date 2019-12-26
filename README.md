<p align="center">
  <img src="./safen.png" alt="safen" width="500" />
</p>

<p align="center">Super Fast Object Validator<br />for Javascript(& Typescript).</p>

<p align="center">
  <a href="https://travis-ci.org/wan2land/safen"><img alt="Build" src="https://img.shields.io/travis/wan2land/safen.svg?style=flat-square" /></a>
  <a href="https://npmcharts.com/compare/safen?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/safen.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/safen"><img alt="Version" src="https://img.shields.io/npm/v/safen.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/safen"><img alt="License" src="https://img.shields.io/npm/l/safen.svg?style=flat-square" /></a>
  <br />
  <a href="https://david-dm.org/wan2land/safen"><img alt="dependencies Status" src="https://img.shields.io/david/wan2land/safen.svg?style=flat-square" /></a>
  <a href="https://david-dm.org/wan2land/safen?type=dev"><img alt="devDependencies Status" src="https://img.shields.io/david/dev/wan2land/safen.svg?style=flat-square" /></a>
</p>

Safen supports the syntax similar to the type script interface. This makes it easy to create validation rules.

- [How to use](#how-to-use)
  - [Setup](#setup)
  - [`validate` method](#validate-method)
  - [`assert` method](#assert-method)
- [Syntax](#syntax)
  - [Type Syntax](#type-syntax)
  - [Object Syntax](#object-syntax)
    - [Optional field](#optional-field)
    - [Nested object](#nested-object)
  - [Array Syntax](#array-syntax)
    - [Fixed size array](#fixed-size-array)
    - [Array with minimum size](#array-with-minimum-size)
    - [Array with maximum size](#array-with-maximum-size)
    - [Sized array](#sized-array)
    - [Nested array](#nested-array)
- [Custom Tester](#custom-tester)
- [Custom Error Messages](#custom-error-messages)
- [Support Validators](#support-validators)
  - [Type Validations](#type-validations)
  - [Other Validations](#other-validations)
- [Comparison](#comparison)
  - [Compare with JSON Schema](#compare-with-json-schema)
  - [Compare with JOI](#compare-with-joi)
- [How Safen works](#how-safen-works)
- [Examples](#examples)
- [License](#license)

## 1.x

Please check [this link](https://github.com/wan2land/safen/tree/1.x) for the 1.x version of the README.

## How to use

### Setup

install,

```bash
npm install safen --save
```

import,

```js
import * as safen from "safen"

// or
const safen = require("safen")
```

then,

```typescript
const validator = safen.sfl`{
  username: (string & email & length_between(12, 100)) | null,
  password?: string & length_between(8, 20),
  areas: {
    lat: number & between(-90, 90),
    lng: number & between(-180, 180),
  }[1:] | null,
  env: {
    referer: url,
    ip: ip("v4"),
    os: {
      name: in("window", "osx", "android", "iphone"),
      version: string,
    },
    browser: {
      name: in("chrome", "firefox", "edge", "ie"),
      version: string,
    },
  },
}`

validator.assert({
  username: "wan2land@gmail.com",
  areas: [
    {lat: 0, lng: 0},
  ],
  env: {
    referer: "http://wan2land.github.io",
    ip: "127.0.0.1",
    os: {
      name: "osx",
      version: "10.13.1",
    },
    browser: {
      name: "chrome",
      version: "62.0.3202.94",
    },
  },
}) // ok
```

There are two method in `Safen`, named `validate`, `assert`. `validate` returns `boolean` and `assert` throws Exception.

### validate method

```typescript
const validator = safen.sfl<string | null>`(string & email & length_between(12, 100)) | null`

// in javascript,
// const validator = safen.sfl`(string & email & length_between(12, 100)) | null`
// const validator = safen.create(`(string & email & length_between(12, 100)) | null`)

// typescript with Generic
if (validator.validate(data)) {
  // now data is string!
}

validator.validate("wan2land@gmail.com") // return true
validator.validate(null) // return true

validator.validate("wan2land") // return false, it is not email!
```

### assert method

```typescript
const validator = safen.sfl<string | null>`(string & email & length_between(12, 100)) | null`

// in javascript,
// const validator = safen.sfl`(string & email & length_between(12, 100)) | null`
// const validator = safen.create(`(string & email & length_between(12, 100)) | null`)

validator.assert("wan2land@gmail.com") // nothing happens
validator.assert(null) // nothing happens

validator.assert("wan2land") // safen.InvalidValudError occured!
```

## Syntax

### Type Syntax

You can easily set the validation by supporting the `and`, `or` syntax.

```typescript
const validator = safen.sfl`{
  username: (string & email & length_between(12, 100)) | null,
}`

validator.assert({
  username: "wan2land@gmail.com",
}) // ok
validator.assert({
  username: null,
}) // ok

try {
  validator.assert({
    username: "wan2land",
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "username",
        reason: "email",
        params: [],
        message: "The username must be a valid email address.",
      },
      {
        path: "username",
        reason: "null",
        params: [],
        message: "The username must be a null.",
      },
    ])
  }
}
```

### Object Syntax

#### Optional field

The "?" character can be used to define optional field, which allows no key value or undefined for objects.

```typescript
const validator = safen.sfl`{
  username: string & length_between(4, 20),
  password?: length_between(8, 20),
}`

validator.assert({
  username: "wan2land",
  password: "password!@#",
}) // ok

validator.assert({
  username: "wan2land",
  // undefined password is OK.
}) // ok

validator.assert({
  username: "wan2land",
  password: undefined, // undefined password is also OK.
}) // ok

try {
  validator.assert({
    // undefined username is not ok.
    password: "password!@#",
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "username",
        reason: "required",
        params: [],
        message: "The username is required.",
      },
    ])
  }
}

try {
  validator.assert({
    username: "wan2land",
    password: null, // null is not allowed
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "password",
        reason: "length",
        params: [],
        message: "The username is required.",
      },
    ])
  }
}
```

#### Nested object

Validating nested objects also can be easily done. In addition, the error message makes it easier to check the error path.

```typescript
const validator = safen.sfl`{
  username: string & length_between(4, 20),
  areas: {
    lat: number & between(-90, 90),
    lng: number & between(-180, 180),
  },
}`

validator.assert({
  username: "wan2land",
  areas: {
    lat: 37,
    lng: 126,
  },
}) // ok

try {
  validator.assert({
    username: "wan2land",
    areas: {
      lat: "37",
      lng: 126,
    },
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "areas.lat",
        reason: "number",
        params: [],
        message: "The areas.lat must be a number.",
      },
    ])
  }
}

validator.assert({
  username: "wan2land",
  areas: {
    lat: 37,
    lng: 126,
  },
}) // ok
```


### Array Syntax

#### Simple array

```typescript
const validator = safen.sfl`{
  areas: {
    lat: number,
    lng: number,
  }[],
}`

validator.assert({
  areas: [], // empty is OK
}) // ok

validator.assert({
  areas: [
    {lat: 37, lng: 126},
    {lat: 31, lng: 125},
  ],
}) // ok

try {
  validator.assert({
    areas: "",
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "areas",
        reason: "array",
        params: [],
        message: "The areas must be an array.",
      },
    ])
  }
}
```

#### Fixed size array

```typescript
const validator = safen.sfl`{
  areas: {
    lat: number,
    lng: number,
  }[2],
}`

validator.assert({
  areas: [
    {lat: 37, lng: 126},
    {lat: 31, lng: 125},
  ],
}) // ok

try {
  validator.assert({
    areas: [
      {lat: 37, lng: 126},
      {lat: 31, lng: 125},
      {lat: 31, lng: 125},
    ],
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "areas",
        reason: "array_length",
        params: [2],
        message: "The areas's length must be 2.",
      },
    ])
  }
}

try {
  validator.assert({
    areas: [
      {lat: 37, lng: 126},
    ],
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "areas",
        reason: "array_length",
        params: [2],
        message: "The areas's length must be 2.",
      },
    ])
  }
}
```

#### Array with minimum size

```typescript
const validator = safen.sfl`{
  areas: {
    lat: number,
    lng: number,
  }[1:],
}`

validator.assert({
  areas: [
    {lat: 31, lng: 125},
  ],
}) // ok

validator.assert({
  areas: [
    {lat: 37, lng: 126},
    {lat: 31, lng: 125},
  ],
}) // ok

try {
  validator.assert({
    areas: [],
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "areas",
        reason: "array_length_min",
        params: [1],
        message: "The areas's length must be at least 1.",
      },
    ])
  }
}
```

#### Array with maximum size

```typescript
const validator = safen.sfl`{
  areas: {
    lat: number,
    lng: number,
  }[:2],
}`

validator.assert({
  areas: [
    {lat: 31, lng: 125},
  ],
}) // ok

validator.assert({
  areas: [
    {lat: 37, lng: 126},
    {lat: 31, lng: 125},
  ],
}) // ok

try {
  validator.assert({
    areas: [
      {lat: 37, lng: 126},
      {lat: 31, lng: 125},
      {lat: 32, lng: 121},
    ],
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "areas",
        reason: "array_length_max",
        params: [2],
        message: "The areas's length may not be greater than 2.",
      },
    ])
  }
}
```

#### Sized array

```typescript
const validator = safen.sfl`{
  areas: {
    lat: number,
    lng: number,
  }[1:2],
}`

validator.assert({
  areas: [
    {lat: 31, lng: 125},
  ],
}) // ok

validator.assert({
  areas: [
    {lat: 37, lng: 126},
    {lat: 31, lng: 125},
  ],
}) // ok

try {
  validator.assert({
    areas: [],
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "areas",
        reason: "array_length_between",
        params: [1, 2],
        message: "The areas's length must be between 1 and 2.",
      },
    ])
  }
}

try {
  validator.assert({
    areas: [
      {lat: 37, lng: 126},
      {lat: 31, lng: 125},
      {lat: 32, lng: 121},
    ],
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "areas",
        reason: "array_length_between",
        params: [1, 2],
        message: "The areas's length must be between 1 and 2.",
      },
    ])
  }
}
```

#### Nested array

```typescript
const validator = safen.sfl`{
  areas: {
    lat: number,
    lng: number,
  }[][],
}`

validator.assert({
  areas: [
    [
      {lat: 37, lng: 126},
      {lat: 31, lng: 125},
    ],
    [
      {lat: 37, lng: 126},
      {lat: 31, lng: 125},
    ],
  ],
}) // ok

try {
  validator.assert({
    areas: [
      {lat: 37, lng: 126},
      {lat: 31, lng: 125},
    ],
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "areas[0]",
        reason: "array",
        params: [],
        message: "The areas[0] must be an array.",
      },
      {
        path: "areas[1]",
        reason: "array",
        params: [],
        message: "The areas[1] must be an array.",
      },
    ])
  }
}
```


## Custom Tester

Custom tester is written in template format like below:

```typescript
const oddTester: safen.Tester = (value, params, gen) => {
  return `(Number.isInteger(${value}) && ${value} % 2 === 1)`
}

const evenTester: safen.Tester = (value, params, gen) => {
  return `(Number.isInteger(${value}) && ${value} % 2 === 0)`
}

const validation = safen.create(`{
  even: even,
  odd: odd,
}`, {
  testers: {
    odd: oddTester,
    even: evenTester,
  },
})

expect(validation.validate({even: 2, odd: 1})).toBeTruthy()

expect(validation.validate({even: 1, odd: 1})).toBeFalsy()
expect(validation.validate({even: 2, odd: 2})).toBeFalsy()
expect(validation.validate({even: 1, odd: 2})).toBeFalsy()
```

A more complex example is:

- example of `params` and `gen`: [before tester](./src/testers/before.ts)

## Custom Error Messages

If needed, you can add custom error messages.

```typescript
const validator = safen.create(`{
  username: email,
}`, {
  messages: {
    email: [
      "this is a custom error message in :path.", // exist `:path`
      "this is a custom error message.", // no `:path`
    ],
  },
})

try {
  validator.assert({
    username: "wan2land",
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {
        path: "username",
        reason: "email",
        params: [],
        message: "this is a custom error message in username.",
      },
    ])
  }
}
```

The `:params` will be replaced by field name. For example :

```typescript
const validator = safen.create(`{
  foo: email,
  bar: between(1, 2),
  baz: in("a", "b", "c"),
}`, {
  messages: {
    required: ["The :path is required.", "It is required."],
    between: ["The :path must be between :param0 and :param1.", "It must be between :param0 and :param1."],
    in: ["The :path does not exist in :params.", "It does not exist in :params."],
  },
})

try {
  validator.assert({
    // foo
    bar: 4,
    baz: "d",
  })
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    expect(e.errors).toEqual([
      {path: "foo", reason: "required", params: [], message: "The foo is required."},
      {path: "bar", reason: "between", params: [1, 2], message: "The bar must be between 1 and 2."},
      {path: "baz", reason: "in", params: ["a", "b", "c"], message: "The baz does not exist in [\"a\",\"b\",\"c\"]."},
    ])
  }
}
```


## Support Validators

### Type Validations

Validator                 | Description
------------------------- | -----------
**bool**                  | check if it is a `boolean`(alias to `boolean`).
**boolean**               | check if it is a `boolean`.
**false**                 | check if it is a `false`.
**float**                 | check if it is a `float`(alias to `number`).
**int**                   | check if it is a `integer`(alias to `integer`).
**integer**               | check if it is a `integer`.
**number**                | check if it is a `number`.
**null**                  | check if it is a `null`.
**object**                | check if it is a `object`.
**string**                | check if it is a `string`.
**symbol**                | check if it is a `symbol`.
**true**                  | check if it is a `true`.

### Other Validations

Validator                 | Description | Example
------------------------- | ----------- | ------- |
**after({date = now})**   | check if `string` is a date and is after than specified date. | `after`, `after("2017-10-01")`, `after("2017-10-01 14:30:00")`
**alpha**                 | check if `string` contains only letters([a-zA-Z]). | `alpha`
**alphanum**              | check if `string` contains only letters and numbers([a-zA-Z0-9]) | `alphanum`
**always_false**          | return always false, for debugging. | `always_false`
**always_true**           | return always true, for debugging. | `always_true`
**any**                   | return always true. | `any`
**ascii**                 | check if `string` contains only ascii characters. | `ascii`
**base64**                | check if `string` is Base64. | `base64`
**before({date = now})**   | check if `string` is a date that's before the specified date. | `before("2017-10-01")`, `before("2017-10-01 14:30:00")`
**between({min},{max})**   | check if value(`string`, `number`) is between `{min}` and `{max}`. | `between("aaa","zzz")`, `between(1,100)`
**creditcard**            | check if `string` is valid Credit Card number. cf. `0000-0000-0000-0000` | `creditcard`
**date**                  | check if `string` is valid Date string(RFC2822, ISO8601). cf. `2018-12-25`, `12/25/2018`, `Dec 25, 2018` | `date`
**email**                 | check if `string` is valid E-mail string. | `email`
**finite**                | check if `number` is not `NaN`, `Infinity`, `-Infinity`. | `finite`
**hexcolor**              | check if `string` is valid Hex Color string. cf. `#ffffff` | `hexcolor`
**in({...params})**        | check if value(`any`) is in an array `{params}`. | `in(1,2,3)`, `in("safari","edge","firefox","other browser")`
**ip({version = all})**    | check if `string` is valid UUID.<br />version is one of `all`(default), `v4`, and `v6`. | `ip`, `ip("v4")`, `ip("v6")`
**json**                  | check if `string` is valid JSON. | `json`
**jwt**                   | check if `string` is valid JWT. | `jwt`
**length({size})**              | check if value(`string`)'s length is `{size}`. | `length(16)`
**length_between({min},{max})** | check if value(`string`)'s length is between `{min}` and `{max}`. | `length_between(4,20)`
**length_max({max})**           | check if value(`string`)'s length is less than `{max}`. | `length_max(20)`
**length_min({min})**           | check if value(`string`)'s length is greater than `{min}`. | `length_min(4)`
**lowercase**             | check if `string` is lowercase. | `lowercase`
**macaddress**            | check if `string` is valid Mac Address. | `macaddress`
**max({max})**             | check if value(`string`, `number`) is less than {min}. | `max(5)`
**min({min})**             | check if value(`string`, `number`) is greater than {max}. | `min(3)`
**nan**                   | check if value(`any`) is NaN. | `nan`
**re**                   | check if value(`any`) match RegExp(alias to `regexp`). | `re(/.+/)`
**regex**                   | check if value(`any`) match RegExp(alias to `regexp`). | `regex(/.+/)`
**regexp**                   | check if value(`any`) match RegExp. | `regexp(/.+/)`
**port**                  | check if `string` is valid PORT(0-65535). | `port`
**uppercase**             | check if `string` is uppercase. | `uppercase`
**url**                   | check if `string` is valid URL. | `url`
**uuid({version = all})**  | check if `string` is valid UUID.<br />version is one of `all`(default), `v3`, `v4`, and `v5`. | `uuid`, `uuid("v3")`, `uuid("v4")`, `uuid("v5")`

## Comparison

Using another library? Safen is lot easier to use.

```sfl
{
  username: (string & email & length_between(12, 100)) | null,
  password?: string & length_between(8, 20),
  areas: {
    lat: number & between(-90, 90),
    lng: number & between(-180, 180),
  }[1:] | null,
  env: {
    referer: url,
    ip: ip("v4"),
    os: {
      name: in("window", "osx", "android", "iphone"),
      version: string,
    },
    browser: {
      name: in("chrome", "firefox", "edge", "ie"),
      version: string,
    },
  },
}
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
              "enum": ["window", "osx", "android", "iphone"],
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
              "enum": ["chrome", "firefox", "edge", "ie"],
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

[JOI](https://github.com/hapijs/joi) is the most popular object schema validation library.

<p>
  <details>
    <summary>Show JOI Source</summary>

```js
Joi.object().keys({
  username: Joi.string().required().allow(null).email().min(12).max(100),
  password: Joi.string().min(8).max(20),
  areas: Joi.array().required().allow(null).min(1).items(Joi.object().keys({
    lat: Joi.number().required().min(-90).max(90),
    lng: Joi.number().required().min(-180).max(180),
  })),
  env: Joi.object().required().keys({
    referer: Joi.string().uri().required(),
    ip: Joi.string().required().ip({version: ["ipv4"]}),
    os: Joi.object().required().keys({
      name: Joi.any().required().only("window", "osx", "android", "iphone"),
      version: Joi.string().required(),
    }),
    browser: Joi.object().required().keys({
      name: Joi.any().required().only("chrome", "firefox", "edge", "ie"),
      version: Joi.string().required(),
    }),
  }),
})
```

  </details>
</p>

## How Safen works

Safen parses the grammar and internally generates an AST(Abstract Syntax Tree) similar to the Json Schema.

```sfl
{
  username: (string & email) | null,
  areas: {
    lat?: number & between(-90, 90),
    lng?: number & between(-180, 180),
  }[1]
}
```

The generated AST is as follows:

<p>
  <details>
    <summary>Show AST</summary>

```json
{
  "type": "object",
  "properties": {
    "username": {
      "optional": false,
      "value": {
        "type": "or",
        "params": [
          {
            "type": "and",
            "params": [
              {
                "type": "scalar",
                "name": "string",
                "params": []
              },
              {
                "type": "scalar",
                "name": "email",
                "params": []
              }
            ]
          },
          {
            "type": "scalar",
            "name": "null",
            "params": []
          }
        ]
      }
    },
    "areas": {
      "optional": false,
      "value": {
        "type": "array",
        "min": 1,
        "max": 1,
        "value": {
          "type": "object",
          "properties": {
            "lat": {
              "optional": true,
              "value": {
                "type": "and",
                "params": [
                  {
                    "type": "scalar",
                    "name": "number",
                    "params": []
                  },
                  {
                    "type": "scalar",
                    "name": "between",
                    "params": [
                      -90,
                      90
                    ]
                  }
                ]
              }
            },
            "lng": {
              "optional": true,
              "value": {
                "type": "and",
                "params": [
                  {
                    "type": "scalar",
                    "name": "number",
                    "params": []
                  },
                  {
                    "type": "scalar",
                    "name": "between",
                    "params": [
                      -180,
                      180
                    ]
                  }
                ]
              }
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

Safen generates native `validate` and `assert` functions based on AST, which make safen lightning fast.

Native `validate` function sample:

<p>
  <details>
    <summary>Show generated <code>validate</code> function.</summary>

```js
function(v) {
  return (function() {
    if (typeof v !== "object" || v === null) {
      return false
    }
    if (typeof v.username === "undefined") {
      return false
    }
    if (!((((typeof(v.username) === "string") && /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v.username)) || v.username === null))) {
      return false
    }
    if (typeof v.areas === "undefined") {
      return false
    }
    if (!((function() {
        if (!Array.isArray(v.areas) || v.areas.length < 1 || v.areas.length > 1) {
          return false
        }
        for (var t0 = 0; t0 < v.areas.length; t0++) {
          if (!((function() {
              if (typeof v.areas[t0] !== "object" || v.areas[t0] === null) {
                return false
              }
              if (typeof v.areas[t0].lat !== "undefined") {
                if (!(((typeof(v.areas[t0].lat) === "number") && (v.areas[t0].lat >= -90 && v.areas[t0].lat <= 90)))) {
                  return false
                }
              }
              if (typeof v.areas[t0].lng !== "undefined") {
                if (!(((typeof(v.areas[t0].lng) === "number") && (v.areas[t0].lng >= -180 && v.areas[t0].lng <= 180)))) {
                  return false
                }
              };
              return true
            })())) {
            return false
          }
        }
        return true
      })())) {
      return false
    };
    return true
  })()
}
```

  </details>
</p>

Native `assert` function sample:

<p>
  <details>
    <summary>Show generated <code>assert</code> function.</summary>

```js
function (v) {
  var path = [];
  var errors = (function() {
    var t0 = [];
    if (typeof v !== "object" || v === null) {
      return [{
        message: message(path.join("").replace(/^\./, ""), "object", []),
        path: path.join("").replace(/^\./, ""),
        reason: "object",
        params: []
      }]
    }
    path.push(".username");
    if (typeof v.username !== "undefined") {
      t0 = t0.concat((function() {
        var t1 = [],
          t2 = (function() {
            var t3 = (function() {
              if (!((typeof(v.username) === "string"))) {
                return [{
                  message: message(path.join("").replace(/^\./, ""), "string", []),
                  path: path.join("").replace(/^\./, ""),
                  reason: "string",
                  params: []
                }]
              }
              return []
            })();
            if (t3.length) {
              return t3
            }
            t3 = (function() {
              if (!(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v.username))) {
                return [{
                  message: message(path.join("").replace(/^\./, ""), "email", []),
                  path: path.join("").replace(/^\./, ""),
                  reason: "email",
                  params: []
                }]
              }
              return []
            })();
            if (t3.length) {
              return t3
            }
            return []
          })();
        if (t2.length === 0) {
          return []
        }
        t1 = t1.concat(t2);
        t2 = (function() {
          if (!(v.username === null)) {
            return [{
              message: message(path.join("").replace(/^\./, ""), "null", []),
              path: path.join("").replace(/^\./, ""),
              reason: "null",
              params: []
            }]
          }
          return []
        })();
        if (t2.length === 0) {
          return []
        }
        t1 = t1.concat(t2);
        return t1
      })())
    } else {
      t0.push({
        message: message(path.join("").replace(/^\./, ""), "required", []),
        path: path.join("").replace(/^\./, ""),
        reason: "required",
        params: []
      })
    }
    path.pop();
    path.push(".areas");
    if (typeof v.areas !== "undefined") {
      t0 = t0.concat((function() {
        if (!Array.isArray(v.areas)) {
          return [{
            message: message(path.join("").replace(/^\./, ""), "array", []),
            path: path.join("").replace(/^\./, ""),
            reason: "array",
            params: []
          }]
        }
        if (v.areas.length !== 1) {
          return [{
            message: message(path.join("").replace(/^\./, ""), "array_length", [1]),
            path: path.join("").replace(/^\./, ""),
            reason: "array_length",
            params: [1]
          }]
        }
        var t4 = [];
        for (var t5 = 0; t5 < v.areas.length; t5++) {
          path.push("[" + t5 + "]");
          t4 = t4.concat((function() {
            var t6 = [];
            if (typeof v.areas[t5] !== "object" || v.areas[t5] === null) {
              return [{
                message: message(path.join("").replace(/^\./, ""), "object", []),
                path: path.join("").replace(/^\./, ""),
                reason: "object",
                params: []
              }]
            }
            path.push(".lat");
            if (typeof v.areas[t5].lat !== "undefined") {
              t6 = t6.concat((function() {
                var t7 = (function() {
                  if (!((typeof(v.areas[t5].lat) === "number"))) {
                    return [{
                      message: message(path.join("").replace(/^\./, ""), "number", []),
                      path: path.join("").replace(/^\./, ""),
                      reason: "number",
                      params: []
                    }]
                  }
                  return []
                })();
                if (t7.length) {
                  return t7
                }
                t7 = (function() {
                  if (!((v.areas[t5].lat >= -90 && v.areas[t5].lat <= 90))) {
                    return [{
                      message: message(path.join("").replace(/^\./, ""), "between", [-90, 90]),
                      path: path.join("").replace(/^\./, ""),
                      reason: "between",
                      params: [-90, 90]
                    }]
                  }
                  return []
                })();
                if (t7.length) {
                  return t7
                }
                return []
              })())
            }
            path.pop();
            path.push(".lng");
            if (typeof v.areas[t5].lng !== "undefined") {
              t6 = t6.concat((function() {
                var t8 = (function() {
                  if (!((typeof(v.areas[t5].lng) === "number"))) {
                    return [{
                      message: message(path.join("").replace(/^\./, ""), "number", []),
                      path: path.join("").replace(/^\./, ""),
                      reason: "number",
                      params: []
                    }]
                  }
                  return []
                })();
                if (t8.length) {
                  return t8
                }
                t8 = (function() {
                  if (!((v.areas[t5].lng >= -180 && v.areas[t5].lng <= 180))) {
                    return [{
                      message: message(path.join("").replace(/^\./, ""), "between", [-180, 180]),
                      path: path.join("").replace(/^\./, ""),
                      reason: "between",
                      params: [-180, 180]
                    }]
                  }
                  return []
                })();
                if (t8.length) {
                  return t8
                }
                return []
              })())
            }
            path.pop();
            return t6
          })());
          path.pop()
        }
        return t4
      })())
    } else {
      t0.push({
        message: message(path.join("").replace(/^\./, ""), "required", []),
        path: path.join("").replace(/^\./, ""),
        reason: "required",
        params: []
      })
    }
    path.pop();
    return t0
  })();
  if (errors.length) throw new InvalidValueError(errors)
}
```

  </details>
</p>

## Examples

- [with express](./examples/with-express)
- [with axios](./examples/with-axios)

## License

MIT

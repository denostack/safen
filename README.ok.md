# Safen

[![Build](https://img.shields.io/travis/corgidisco/safen.svg)](https://travis-ci.org/corgidisco/safen)
[![Downloads](https://img.shields.io/npm/dt/safen.svg)](https://npmcharts.com/compare/safen?minimal=true)
[![Version](https://img.shields.io/npm/v/safen.svg)](https://www.npmjs.com/package/safen)
[![License](https://img.shields.io/npm/l/safen.svg)](https://www.npmjs.com/package/safen)

[![dependencies Status](https://david-dm.org/corgidisco/safen/status.svg)](https://david-dm.org/corgidisco/safen)
[![devDependencies Status](https://david-dm.org/corgidisco/safen/dev-status.svg)](https://david-dm.org/corgidisco/safen?type=dev)

[![NPM](https://nodei.co/npm/safen.png)](https://www.npmjs.com/package/safen)

Super Fast Object Validator for Javascript(& Typescript).

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

Please check [this link](https://github.com/corgidisco/safen/tree/1.x) for the 1.x version of the README.

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

@code("./test/readme.test.ts@usage-default", "typescript")

There are two method in `Safen`, named `validate`, `assert`. `validate` is return boolean, `assert` occure Exception.

### validate method

@code("./test/readme.test.ts@usage-validate", "typescript")

### assert method

@code("./test/readme.test.ts@usage-assert", "typescript")

## Syntax

### Type Syntax

You can easily set the validation by supporting the `and`, `or` syntax.

@code("./test/readme.test.ts@sample-pipe", "typescript")

### Object Syntax

#### Optional field

The optional grammar is available through the "?" character. You can allow no key value in the object, or undefined.

@code("./test/readme.test.ts@sample-optional", "typescript")

#### Nested object

Objects in objects are also easy to use. In addition, the error message makes it easy to check the error path.

@code("./test/readme.test.ts@sample-object-in-object", "typescript")


### Array Syntax

#### Simple array

@code("./test/readme.test.ts@sample-simple-array", "typescript")

#### Fixed size array

@code("./test/readme.test.ts@sample-array-with-range-fixed", "typescript")

#### Array with minimum size

@code("./test/readme.test.ts@sample-array-with-range-min", "typescript")

#### Array with maximum size

@code("./test/readme.test.ts@sample-array-with-range-max", "typescript")

#### Sized array

@code("./test/readme.test.ts@sample-array-with-range-between", "typescript")

#### Nested array

@code("./test/readme.test.ts@sample-array-with-multi-dims", "typescript")


## Custom Tester

Custom tester is written in template format like below:

@code("./test/readme.test.ts@sample-custom-tester", "typescript")

A more complex example is:

- example of `params` and `gen`: [before tester](./src/testers/before.ts)

## Custom Error Messages

If needed, you can add custom error messages.

@code("./test/readme.test.ts@sample-custom-error-messages", "typescript")

The `:params` will be replaced by field name. For example :

@code("./test/readme.test.ts@sample-custom-error-messages-examples", "typescript")


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
**afte({date = now})**     | check if the `string` is a date that's after the specified date. | `after`, `after("2017-10-01")`, `after("2017-10-01 14:30:00")`
**alpha**                 | check if the `string` contains only letters([a-zA-Z]). | `alpha`
**alphanum**              | check if the `string` contains only letters and numbers([a-zA-Z0-9]) | `alphanum`
**always_false**          | return always false, for debugging. | `always_false`
**always_true**           | return always true, for debugging. | `always_true`
**any**                   | return always true. | `any`
**ascii**                 | check if the `string` contains only ascii characters. | `ascii`
**base64**                | check if the `string` is Base64. | `base64`
**before({date = now})**   | check if the `string` is a date that's before the specified date. | `before("2017-10-01")`, `before("2017-10-01 14:30:00")`
**between({min},{max})**   | check if the value(`string`, `number`) is between `{min}` and `{max}`. | `between("aaa","zzz")`, `between(1,100)`
**creditcard**            | check if the `string` is valid Credit Card number. cf. `0000-0000-0000-0000` | `creditcard`
**date**                  | check if the `string` is valid Date string(RFC2822, ISO8601). cf. `2018-12-25`, `12/25/2018`, `Dec 25, 2018` | `date`
**email**                 | check if the `string` is valid E-mail string. | `email`
**finite**                | check if the `number` is not `NaN`, `Infinity`, `-Infinity`. | `finite`
**hexcolor**              | check if the `string` is valid Hex Color string. cf. `#ffffff` | `hexcolor`
**in({...params})**        | check if the value(`any`) is in an array `{params}`. | `in(1,2,3)`, `in("safari","edge","firefox","other browser")`
**ip({version = all})**    | check if the `string` is valid UUID.<br />version is one of `all`(default), `v4`, and `v6`. | `ip`, `ip("v4")`, `ip("v6")`
**json**                  | check if the `string` is valid JSON. | `json`
**jwt**                   | check if the `string` is valid JWT. | `jwt`
**length({size})**              | check if the value(`string`)'s length is `{size}`. | `length(16)`
**length_between({min},{max})** | check if the value(`string`)'s length is between `{min}` and `{max}`. | `length_between(4,20)`
**length_max({max})**           | check if the value(`string`)'s length is less than `{max}`. | `length_max(20)`
**length_min({min})**           | check if the value(`string`)'s length is greater than `{min}`. | `length_min(4)`
**lowercase**             | check if the `string` is lowercase. | `lowercase`
**macaddress**            | check if the `string` is valid Mac Address. | `macaddress`
**max({max})**             | check if the value(`string`, `number`) is less than {min}. | `max(5)`
**min({min})**             | check if the value(`string`, `number`) is greater than {max}. | `min(3)`
**nan**                   | check if the value(`any`) is NaN. | `nan`
**re**                   | check if the value(`any`) match RegExp(alias to `regexp`). | `regexp(/.+/)`
**regex**                   | check if the value(`any`) match RegExp(alias to `regexp`). | `regexp(/.+/)`
**regexp**                   | check if the value(`any`) match RegExp. | `regexp(/.+/)`
**port**                  | check if the `string` is valid PORT(0-65535). | `port`
**uppercase**             | check if the `string` is uppercase. | `uppercase`
**url**                   | check if the `string` is valid URL. | `url`
**uuid({version = all})**  | check if the `string` is valid UUID.<br />version is one of `all`(default), `v3`, `v4`, and `v5`. | `uuid`, `uuid("v3")`, `uuid("v4")`, `uuid("v5")`

## Comparison

If you have used another library, please refer to the following.

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

Safen parses the grammar and internally generates an AST similar to the Json Schema.

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

It then generates `validate` and `assert` functions based on AST.
And, it is very fast because it generates native functions.

The `validate` function is generated as follows:

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

The assert function also creates a native function like this.

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

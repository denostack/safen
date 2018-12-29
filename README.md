# Safen

[![Downloads](https://img.shields.io/npm/dm/safen.svg)](https://npmcharts.com/compare/safen?minimal=true)
[![Version](https://img.shields.io/npm/v/safen.svg)](https://www.npmjs.com/package/safen)
[![License](https://img.shields.io/npm/l/safen.svg)](https://www.npmjs.com/package/safen)

[![NPM](https://nodei.co/npm/safen.png)](https://www.npmjs.com/package/safen)

Complex Object Validator Based on [lodash](https://github.com/lodash/lodash.js) and
[validator](https://github.com/chriso/validator.js) for TypeScript and JavaScript.

## Install

```
npm install safen --save
```

## Usage

Import,

```js
import * as safen from "safen"
// or
const safen = require("safen")
```

then,

```typescript
const validator = safen.create({
  "username": "string & email & length_between:12,100",
  "password?": "string & length_between:8,20",
  "areas[1:]": {
    lat: "number & between:-90,90",
    lng: "number & between:-180,180",
  },
  "env": {
    referer: "url",
    ip: "ip:v4",
    os: {
      name: "in:window,osx,android,iphone",
      version: "string",
    },
    browser: {
      name: "in:chrome,firefox,edge,ie",
      version: "string",
    },
  },
})

validator.assert({
  username: "corgidisco@gmail.com",
  areas: [
    {lat: 0, lng: 0},
  ],
  env: {
    referer: "http://corgidisco.github.io",
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


## Rule Examples

### Pipe

```typescript
const validator = safen.create({
  username: "string & email & length_between:12,100",
})

validator.assert({
  username: "corgidisco@gmail.com",
}) // ok

try {
  validator.assert({
    username: "corgidisco",
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
    ])
  }
}
```

### Optional

```typescript
const validator = safen.create({
  "username": "string & length_between:4,20",
  "password?": "length_between:8,20", // optional
})

validator.assert({
  username: "corgidisco",
  password: "password!@#",
}) // ok

validator.assert({
  username: "username",
  // undefined password is OK.
}) // ok

validator.assert({
  username: "username",
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
    username: "username",
    password: null, // null password is not OK
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

### Object in Object

```typescript
const validator = safen.create({
  username: "string & length_between:4,20",
  areas: {
    lat: "number & between:-90,90",
    lng: "number & between:-180,180",
  },
})

validator.assert({
  username: "corgidisco",
  areas: {
    lat: 37,
    lng: 126,
  },
}) // ok
```

### Array

**Simple Array**

```typescript
const validator = safen.create({
  "areas[]": { // array
    lat: "number",
    lng: "number",
  },
})

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

**Array With Range - Fixed**

```typescript
const validator = safen.create({
  "areas[2]": { // array
    lat: "number",
    lng: "number",
  },
})

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

**Array With Range - Min**

```typescript
const validator = safen.create({
  "areas[1:]": { // array
    lat: "number",
    lng: "number",
  },
})

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

**Array With Range - Max**

```typescript
const validator = safen.create({
  "areas[:2]": { // array
    lat: "number",
    lng: "number",
  },
})

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

**Array With Range - Between**

```typescript
const validator = safen.create({
  "areas[1:2]": { // array
    lat: "number",
    lng: "number",
  },
})

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

**Array with Multi Dimension**

```typescript
const validator = safen.create({
  "areas[][]": { // array
    lat: "number",
    lng: "number",
  },
})

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
        path: "areas.0",
        reason: "array",
        params: [],
        message: "The areas.0 must be an array.",
      },
      {
        path: "areas.1",
        reason: "array",
        params: [],
        message: "The areas.1 must be an array.",
      },
    ])
  }
}
```

## Custom Error Messages

If needed, you can add custom error messages.

```typescript
//   const validator = safen.create({
//     username: "email",
//   }, {
//     messages: {
//       email: [
//         "this is a custom message in :attribute.", // exist `:attribute`
//         "this is a custom message.", // no `:attribute`
//       ],
//     },
//   })

//   try {
//     validator.assert({
//       username: "corgidisco",
//     }) // fail
//   } catch (e) {
//     if (e instanceof safen.InvalidValueError) {
//       // output is :
//       // [ { reason: 'email@username', message: 'this is a custom message in username.' } ]
//       console.log(e.errors)
//     }
//   }
```

The `:attribute` will be replaced by field name. For example :

```typescript
//   const messages = {
//     required: ["The :attribute is required.", "It is required."],
//     between: ["The :attribute must be between :arg0 and :arg1.", "It must be between :arg0 and :arg1."],
//     in: ["The :attribute does not exist in :args.", "It does not exist in :args."],
//   }
```

## Validators

### Type

Validator                 | Description
------------------------- | -----------
**bool**                  | check if it is a `boolean`(alias to `boolean`).
**boolean**               | check if it is a `boolean`.
**float**                 | check if it is a `float`.
**int**                   | check if it is a `integer`(alias to `integer`).
**integer**               | check if it is a `integer`.
**number**                | check if it is a `number`.
**null**                  | check if it is a `null`.
**string**                | check if it is a `string`.
**symbol**                | check if it is a `symbol`.

Validator                 | Description | Example
------------------------- | ----------- | ------- |
**afte:{date = now}**     | check if the `string` is a date that's after the specified date. | `after`, `after:"2017-10-01"`, `after:"2017-10-01 14:30:00"`
**alpha**                 | check if the `string` contains only letters([a-zA-Z]). | `alpha`
**alphanum**              | check if the `string` contains only letters and numbers([a-zA-Z0-9]) | `alphanum`
**always_false**          | return always false, for debugging. | `always_false`
**always_true**           | return always true, for debugging. | `always_true`
**ascii**                 | check if the `string` contains only ascii characters. | `ascii`
**base64**                | check if the `string` is Base64. | `base64`
**before:{date = now}**   | check if the `string` is a date that's before the specified date. | `before:2017-10-01`, `before:2017-10-01 14:30:00`
**between:{min},{max}**   | check if the value(`string`, `number`) is between `{min}` and `{max}`. | `between:aaa,zzz`, `between:1,100`
**creditcard**            | check if the `string` is valid Credit Card number. cf. `0000-0000-0000-0000` | `creditcard`
**date**                  | check if the `string` is valid Date string(RFC2822, ISO8601). cf. `2018-12-25`, `12/25/2018`, `Dec 25, 2018` | `date`
**email**                 | check if the `string` is valid E-mail string. | `email`
**finite**                | check if the `number` is not `NaN`, `Infinity`, `-Infinity`. | `finite`
**hexcolor**              | check if the `string` is valid Hex Color string. cf. `#ffffff` | `hexcolor`
**in:{...params}**        | check if the value(`any`) is in an array `{params}`. | `in:1,2,3`, `in:safari,edge,firefox,"other browser"`
**ip:{version = all}**    | check if the `string` is valid UUID.<br />version is one of `all`(default), `v4`, and `v6`. | `ip`, `ip:v4`, `ip:v6`
**json**                  | check if the `string` is valid JSON. | `json`
**jwt**                   | check if the `string` is valid JWT. | `jwt`
**length:{size}**              | check if the value(`string`)'s length is `{size}`. | `length:16`
**length_between:{min},{max}** | check if the value(`string`)'s length is between `{min}` and `{max}`. | `length_between:4,20`
**length_max:{max}**           | check if the value(`string`)'s length is less than `{max}`. | `length_max:20`
**length_min:{min}**           | check if the value(`string`)'s length is greater than `{min}`. | `length_min:4`
**lowercase**             | check if the `string` is lowercase. | `lowercase`
**macaddress**            | check if the `string` is valid Mac Address. | `macaddress`
**max:{max}**             | check if the value(`string`, `number`) is less than {min}. | `max:5`
**min:{min}**             | check if the value(`string`, `number`) is greater than {max}. | `min:3`
**nan**                   | check if the value(`any`) is NaN. | `nan`
**port**                  | check if the `string` is valid PORT(0-65535). | `port`
**uppercase**             | check if the `string` is uppercase. | `uppercase`
**url**                   | check if the `string` is valid URL. | `url`
**uuid:{version = all}**  | check if the `string` is valid UUID.<br />version is one of `all`(default), `v3`, `v4`, and `v5`. | `uuid`, `uuid:v3`, `uuid:v4`, `uuid:v5`

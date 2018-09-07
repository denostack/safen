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
  "username": "string|email|length_between:12,100",
  "password?": "string|length_between:8,20",
  "areas[1:]": {
    lat: "number|between:-90,90",
    lng: "number|between:-180,180",
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
  username: "string|email|length_between:12,100",
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
    // output is :
    // [ { reason: 'email@username', message: 'The username must be a valid email address.' },
    //   { reason: 'length_between:12,100@username', message: 'The username\'s length must be between 12 and 100.' } ]
    console.log(e.errors())
  }
}
```

### Optional

```typescript
const validator = safen.create({
  "username": "string|length_between:4,20",
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
  password: null, // null password is also OK.
}) // ok

try {
  validator.assert({
    // undefined username is not ok.
    password: "password!@#",
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    // output is :
    // [ { reason: 'required@username', message: 'The username is required.' } ]
    console.log(e.errors())
  }
}
```

### Object in Object

```typescript
const validator = safen.create({
  username: "string|length_between:4,20",
  areas: {
    lat: "number|between:-90,90",
    lng: "number|between:-180,180",
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
    // output is :
    // [ { reason: 'array@areas', message: 'The areas must be an array.' } ]
    console.log(e.errors())
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
    // output is :
    // [ { reason: 'array_length:2@areas', message: 'The areas's length must be 2.' } ]
    console.log(e.errors())
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
    // output is :
    // [ { reason: 'array_length:2@areas', message: 'The areas's length must be 2.' } ]
    console.log(e.errors())
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
    // output is :
    // [ { reason: 'array_length_min:1@areas', message: 'The areas's length must be at least 1.' } ]
    console.log(e.errors())
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
    // output is :
    // [ { reason: 'array_length_max:2@areas', message: 'The areas's length may not be greater than 2.' } ]
    console.log(e.errors())
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
    // output is :
    // [ { reason: 'array_length_between:1,2@areas', message: 'The areas's length must be between 1 and 2.' } ]
    console.log(e.errors())
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
    // output is :
    // [ { reason: 'array_length_between:1,2@areas', message: 'The areas's length must be between 1 and 2.' } ]
    console.log(e.errors())
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
    // output is :
    // [ { reason: 'array@areas[0]', message: 'The areas[0] must be an array.' },
    //   { reason: 'array@areas[1]', message: 'The areas[1] must be an array.' } ]
    console.log(e.errors())
  }
}
```

## Custom Error Messages

If needed, you can add custom error messages.

```typescript
const validator = safen.create({
  username: "email",
}, {
  messages: {
    email: [
      "this is a custom message in :attribute.", // exist `:attribute`
      "this is a custom message.", // no `:attribute`
    ],
  },
})

try {
  validator.assert({
    username: "corgidisco",
  }) // fail
} catch (e) {
  if (e instanceof safen.InvalidValueError) {
    // output is :
    // [ { reason: 'email@username', message: 'this is a custom message in username.' } ]
    console.log(e.errors())
  }
}
```

The `:attribute` will be replaced by field name. For example :

```typescript
const messages = {
  required: ["The :attribute is required.", "It is required."],
  between: ["The :attribute must be between :arg0 and :arg1.", "It must be between :arg0 and :arg1."],
  in: ["The :attribute does not exist in :args.", "It does not exist in :args."],
}
```

## Validators

Validator                     | Description                             | Example
----------------------------- | --------------------------------------- | ------------------------------------------------
**afte:{date = now}**         | alias `validator.isAfter`               | `after:2017-10-01`, `after:2017-10-01 14:30:00`
**alpha:{locale = en-US}**    | alias `validator.isAlpha`               | `alpha`, `alpha:de-DE`
**alphanum{locale = en-US}**  | alias `validator.isAlphanumeric`        | `alphanum`, `alphanum:de-DE`
**always_false**              | return always false, for debugging.      |
**always_true**               | return always true, for debugging.       |
**ascii**                     | alias `validator.isAscii`               |
**base64**                    | alias `validator.isBase64`              |
**before:{date = now}**       | alias `validator.isBefore`              | `before:2017-10-01`, `before:2017-10-01 14:30:00`
**between:{min},{max}**       | check if the value is between {min} and {max}. | `between:aaa,zzz`, `between:1,100`
**boolean**                   | alias `lodash.isBoolean`                |
**boolean_string**            | alias `validator.isBoolean`             |
**buffer**                    | alias `lodash.isBuffer`                 |
**creditcard**                | alias `validator.isCreditCard`          |
**data_uri**                  | alias `validator.isDataURI`             |
**data_uri**                  | alias `validator.isDataURI`             |
**decimal_string**            | alias `validator.isDecimal`             |
**domain**                    | alias `validator.isFQDN`                |
**email**                     | alias `validator.isEmail`               |
**finite**                    | alias `lodash.isFinite`                 |
**float**                     | alias `lodash.isNumber`                 |
**hash:{algorithm}**          | alias `validator.isHash`                | `hash:md4`, `hash:md5` ..
**hexcolor**                  | alias `validator.isHexColor`            |
**hexadecimal**               | alias `validator.isHexadecimal`         |
**in:{...args}**              | check if the value is in an array {args}| `in:1,2,3`
**int**                       | alias `lodash.isInteger`                |
**integer**                   | alias `lodash.isInteger`                |
**ip:{version = null}**       | alias `validator.isIP`                  | `ip`, `ip:v4`, `ip:v6`
**isbn{version = null}**      | alias `validator.isISBN`                | `isbn`, `isbn:v10`, `isbn:v13`
**issn**                      | alias `validator.isISSN`                |
**isin**                      | alias `validator.isISIN`                |
**isrc**                      | alias `validator.isISRC`                |
**json**                      | alias `validator.isJSON`                |
**lowercase**                 | alias `validator.isLowercase`           |
**length:{len}**              | check if the value's length is {len}.   | `length:16`
**length_between:{min},{max}**| check if the value's length is between {min} and {max}. | `length_between:4,20`
**length_max:{max}**          | check if the value's length is less than {max}. | `length_max:20`
**length_min:{min}**          | check if the value's length is greater than {min}. | `length_min:4`
**macaddress**                | alias `validator.isMACAddress`          |
**map**                       | alias `lodash.isMap`                    |
**max:{max}**                 | check if the value is less than {min}.  |
**min:{min}**                 | check if the value is greater than {max}. |
**mobilephone:{locale}**      | alias `validator.isMobilePhone`         |
**mongoid**                   | alias `validator.isMongoId`             |
**nan**                       | alias `lodash.isNaN`                    |
**number**                    | alias `lodash.isNumber`                 |
**number_string**             | alias `validator.isFloat`               |
**object**                    | alias `lodash.isObject`                 |
**postalcode:{locale}**       | alias `validator.isPostalCode`          |
**set**                       | alias `lodash.isSet`                    |
**string**                    | alias `lodash.isString`                 |
**symbol**                    | alias `lodash.isSymbol`                 |
**uppercase**                 | alias `validator.isUppercase`           |
**url**                       | alias `validator.isURL`                 |
**uuid**                      | alias `validator.isUUID`                |

### lodash validators

**Example**

```typescript
const validator = safen.create({
  "areas[]": {
    lat: "lodash.isNumber",
    lng: "lodash.isNumber",
  },
})

validator.assert({
  areas: [
    {lat: 37, lng: 126},
    {lat: 31, lng: 125},
  ],
}) // ok
```

Validator                     | Description                             | Documents
----------------------------- | --------------------------------------- | ------------------------------------------------
**lodash.isArguments**        | use function `lodash.isArguments`       | [lodash documents #isArguments](https://lodash.com/docs/4.17.4#isArguments)
**lodash.isArray**            | use function `lodash.isArray`           | [lodash documents #isArray](https://lodash.com/docs/4.17.4#isArray)
**lodash.isArrayBuffer**      | use function `lodash.isArrayBuffer`     | [lodash documents #isArrayBuffer](https://lodash.com/docs/4.17.4#isArrayBuffer)
**lodash.isArrayLike**        | use function `lodash.isArrayLike`       | [lodash documents #isArrayLike](https://lodash.com/docs/4.17.4#isArrayLike)
**lodash.isArrayLikeObject**  | use function `lodash.isArrayLikeObject` | [lodash documents #isArrayLikeObject](https://lodash.com/docs/4.17.4#isArrayLikeObject)
**lodash.isBoolean**          | use function `lodash.isBoolean`         | [lodash documents #isBoolean](https://lodash.com/docs/4.17.4#isBoolean)
**lodash.isBuffer**           | use function `lodash.isBuffer`          | [lodash documents #isBuffer](https://lodash.com/docs/4.17.4#isBuffer)
**lodash.isDate**             | use function `lodash.isDate`            | [lodash documents #isDate](https://lodash.com/docs/4.17.4#isDate)
**lodash.isElement**          | use function `lodash.isElement`         | [lodash documents #isElement](https://lodash.com/docs/4.17.4#isElement)
**lodash.isEmpty**            | use function `lodash.isEmpty`           | [lodash documents #isEmpty](https://lodash.com/docs/4.17.4#isEmpty)
**lodash.isError**            | use function `lodash.isError`           | [lodash documents #isError](https://lodash.com/docs/4.17.4#isError)
**lodash.isFinite**           | use function `lodash.isFinite`          | [lodash documents #isFinite](https://lodash.com/docs/4.17.4#isFinite)
**lodash.isFunction**         | use function `lodash.isFunction`        | [lodash documents #isFunction](https://lodash.com/docs/4.17.4#isFunction)
**lodash.isInteger**          | use function `lodash.isInteger`         | [lodash documents #isInteger](https://lodash.com/docs/4.17.4#isInteger)
**lodash.isLength**           | use function `lodash.isLength`          | [lodash documents #isLength](https://lodash.com/docs/4.17.4#isLength)
**lodash.isMap**              | use function `lodash.isMap`             | [lodash documents #isMap](https://lodash.com/docs/4.17.4#isMap)
**lodash.isNaN**              | use function `lodash.isNaN`             | [lodash documents #isNaN](https://lodash.com/docs/4.17.4#isNaN)
**lodash.isNative**           | use function `lodash.isNative`          | [lodash documents #isNative](https://lodash.com/docs/4.17.4#isNative)
**lodash.isNil**              | use function `lodash.isNil`             | [lodash documents #isNil](https://lodash.com/docs/4.17.4#isNil)
**lodash.isNull**             | use function `lodash.isNull`            | [lodash documents #isNull](https://lodash.com/docs/4.17.4#isNull)
**lodash.isNumber**           | use function `lodash.isNumber`          | [lodash documents #isNumber](https://lodash.com/docs/4.17.4#isNumber)
**lodash.isObject**           | use function `lodash.isObject`          | [lodash documents #isObject](https://lodash.com/docs/4.17.4#isObject)
**lodash.isObjectLike**       | use function `lodash.isObjectLike`      | [lodash documents #isObjectLike](https://lodash.com/docs/4.17.4#isObjectLike)
**lodash.isPlainObject**      | use function `lodash.isPlainObject`     | [lodash documents #isPlainObject](https://lodash.com/docs/4.17.4#isPlainObject)
**lodash.isRegExp**           | use function `lodash.isRegExp`          | [lodash documents #isRegExp](https://lodash.com/docs/4.17.4#isRegExp)
**lodash.isSafeInteger**      | use function `lodash.isSafeInteger`     | [lodash documents #isSafeInteger](https://lodash.com/docs/4.17.4#isSafeInteger)
**lodash.isSet**              | use function `lodash.isSet`             | [lodash documents #isSet](https://lodash.com/docs/4.17.4#isSet)
**lodash.isString**           | use function `lodash.isString`          | [lodash documents #isString](https://lodash.com/docs/4.17.4#isString)
**lodash.isSymbol**           | use function `lodash.isSymbol`          | [lodash documents #isSymbol](https://lodash.com/docs/4.17.4#isSymbol)
**lodash.isTypedArray**       | use function `lodash.isTypedArray`      | [lodash documents #isTypedArray](https://lodash.com/docs/4.17.4#isTypedArray)
**lodash.isUndefined**        | use function `lodash.isUndefined`       | [lodash documents #isUndefined](https://lodash.com/docs/4.17.4#isUndefined)
**lodash.isWeakMap**          | use function `lodash.isWeakMap`         | [lodash documents #isWeakMap](https://lodash.com/docs/4.17.4#isWeakMap)
**lodash.isWeakSet**          | use function `lodash.isWeakSet`         | [lodash documents #isWeakSet](https://lodash.com/docs/4.17.4#isWeakSet)

### validator validators

**Example**

```typescript
const validator = safen.create({
  username: "validator.isEmail",
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
    // output is :
    // [ { reason: 'validator.isEmail@username', message: 'An validator.isEmail error occured in username.' } ]
    console.log(e.errors())
  }
}
```

[validator documents #validators](https://github.com/chriso/validator.js/#validators)

Validator                     | Description
----------------------------- | ---------------------------------------
**validator.isAfter**         | use function `validator.isAfter` 
**validator.isAlpha**         | use function `validator.isAlpha` 
**validator.isAlphanumeric**  | use function `validator.isAlphanumeric`
**validator.isAscii**         | use function `validator.isAscii` 
**validator.isBase64**        | use function `validator.isBase64`
**validator.isBefore**        | use function `validator.isBefore`
**validator.isBoolean**       | use function `validator.isBoolean` 
**validator.isByteLength**    | use function `validator.isByteLength`
**validator.isCreditCard**    | use function `validator.isCreditCard`
**validator.isCurrency**      | use function `validator.isCurrency`
**validator.isDataURI**       | use function `validator.isDataURI` 
**validator.isDecimal**       | use function `validator.isDecimal` 
**validator.isDivisibleBy**   | use function `validator.isDivisibleBy` 
**validator.isEmail**         | use function `validator.isEmail` 
**validator.isEmpty**         | use function `validator.isEmpty` 
**validator.isFQDN**          | use function `validator.isFQDN`
**validator.isFloat**         | use function `validator.isFloat` 
**validator.isFullWidth**     | use function `validator.isFullWidth` 
**validator.isHalfWidth**     | use function `validator.isHalfWidth` 
**validator.isHash**          | use function `validator.isHash`
**validator.isHexColor**      | use function `validator.isHexColor`
**validator.isHexadecimal**   | use function `validator.isHexadecimal` 
**validator.isIP**            | use function `validator.isIP`
**validator.isISBN**          | use function `validator.isISBN`
**validator.isISSN**          | use function `validator.isISSN`
**validator.isISIN**          | use function `validator.isISIN`
**validator.isISO8601**       | use function `validator.isISO8601` 
**validator.isISO31661Alpha2**| use function `validator.isISO31661Alpha2`
**validator.isISRC**          | use function `validator.isISRC`
**validator.isIn**            | use function `validator.isIn`
**validator.isInt**           | use function `validator.isInt` 
**validator.isJSON**          | use function `validator.isJSON`
**validator.isLatLong**       | use function `validator.isLatLong` 
**validator.isLength**        | use function `validator.isLength`
**validator.isLowercase**     | use function `validator.isLowercase` 
**validator.isMACAddress**    | use function `validator.isMACAddress`
**validator.isMD5**           | use function `validator.isMD5` 
**validator.isMobilePhone**   | use function `validator.isMobilePhone` 
**validator.isMongoId**       | use function `validator.isMongoId` 
**validator.isMultibyte**     | use function `validator.isMultibyte` 
**validator.isNumeric**       | use function `validator.isNumeric` 
**validator.isPort**          | use function `validator.isPort`
**validator.isPostalCode**    | use function `validator.isPostalCode`
**validator.isSurrogatePair** | use function `validator.isSurrogatePair` 
**validator.isURL**           | use function `validator.isURL` 
**validator.isUUID**          | use function `validator.isUUID`
**validator.isUppercase**     | use function `validator.isUppercase` 
**validator.isVariableWidth** | use function `validator.isVariableWidth` 
**validator.isWhitelisted**   | use function `validator.isWhitelisted`


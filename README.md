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
//     const validator = safen.create({
//       "username": "string|email|length_between:12,100",
//       "password?": "string|length_between:8,20",
//       "areas[1:]": {
//         lat: "number|between:-90,90",
//         lng: "number|between:-180,180",
//       },
//       "env": {
//         referer: "url",
//         ip: "ip:v4",
//         os: {
//           name: "in:window,osx,android,iphone",
//           version: "string",
//         },
//         browser: {
//           name: "in:chrome,firefox,edge,ie",
//           version: "string",
//         },
//       },
//     })

//     validator.assert({
//       username: "corgidisco@gmail.com",
//       areas: [
//         {lat: 0, lng: 0},
//       ],
//       env: {
//         referer: "http://corgidisco.github.io",
//         ip: "127.0.0.1",
//         os: {
//           name: "osx",
//           version: "10.13.1",
//         },
//         browser: {
//           name: "chrome",
//           version: "62.0.3202.94",
//         },
//       },
//     }) // ok
```


## Rule Examples

### Pipe

```typescript
//     const validator = safen.create({
//       username: "string|email|length_between:12,100",
//     })

//     validator.assert({
//       username: "corgidisco@gmail.com",
//     }) // ok

//     try {
//       validator.assert({
//         username: "corgidisco",
//       }) // fail
//     } catch (e) {
//       if (e instanceof safen.InvalidValueError) {
//         // output is :
//         // [ { reason: 'email@username', message: 'The username must be a valid email address.' },
//         //   { reason: 'length_between:12,100@username', message: 'The username\'s length must be between 12 and 100.' } ]
//         console.log(e.errors())
//       }
//     }
```

### Optional

```typescript
//     const validator = safen.create({
//       "username": "string|length_between:4,20",
//       "password?": "length_between:8,20", // optional
//     })

//     validator.assert({
//       username: "corgidisco",
//       password: "password!@#",
//     }) // ok

//     validator.assert({
//       username: "username",
//       // undefined password is OK.
//     }) // ok

//     validator.assert({
//       username: "username",
//       password: null, // null password is also OK.
//     }) // ok

//     try {
//       validator.assert({
//         // undefined username is not ok.
//         password: "password!@#",
//       }) // fail
//     } catch (e) {
//       if (e instanceof safen.InvalidValueError) {
//         // output is :
//         // [ { reason: 'required@username', message: 'The username is required.' } ]
//         console.log(e.errors())
//       }
//     }
```

### Object in Object

```typescript
//     const validator = safen.create({
//       username: "string|length_between:4,20",
//       areas: {
//         lat: "number|between:-90,90",
//         lng: "number|between:-180,180",
//       },
//     })

//     validator.assert({
//       username: "corgidisco",
//       areas: {
//         lat: 37,
//         lng: 126,
//       },
//     }) // ok
```

### Array

**Simple Array**

```typescript
//     const validator = safen.create({
//       "areas[]": { // array
//         lat: "number",
//         lng: "number",
//       },
//     })

//     validator.assert({
//       areas: [], // empty is OK
//     }) // ok

//     validator.assert({
//       areas: [
//         {lat: 37, lng: 126},
//         {lat: 31, lng: 125},
//       ],
//     }) // ok

//     try {
//       validator.assert({
//         areas: "",
//       }) // fail
//     } catch (e) {
//       if (e instanceof safen.InvalidValueError) {
//         // output is :
//         // [ { reason: 'array@areas', message: 'The areas must be an array.' } ]
//         console.log(e.errors())
//       }
//     }
```

**Array With Range - Fixed**

```typescript
//     const validator = safen.create({
//       "areas[2]": { // array
//         lat: "number",
//         lng: "number",
//       },
//     })

//     validator.assert({
//       areas: [
//         {lat: 37, lng: 126},
//         {lat: 31, lng: 125},
//       ],
//     }) // ok

//     try {
//       validator.assert({
//         areas: [
//           {lat: 37, lng: 126},
//           {lat: 31, lng: 125},
//           {lat: 31, lng: 125},
//         ],
//       }) // fail
//     } catch (e) {
//       if (e instanceof safen.InvalidValueError) {
//         // output is :
//         // [ { reason: 'array_length:2@areas', message: 'The areas's length must be 2.' } ]
//         console.log(e.errors())
//       }
//     }

//     try {
//       validator.assert({
//         areas: [
//           {lat: 37, lng: 126},
//         ],
//       }) // fail
//     } catch (e) {
//       if (e instanceof safen.InvalidValueError) {
//         // output is :
//         // [ { reason: 'array_length:2@areas', message: 'The areas's length must be 2.' } ]
//         console.log(e.errors())
//       }
//     }
```

**Array With Range - Min**

```typescript
//     const validator = safen.create({
//       "areas[1:]": { // array
//         lat: "number",
//         lng: "number",
//       },
//     })

//     validator.assert({
//       areas: [
//         {lat: 31, lng: 125},
//       ],
//     }) // ok

//     validator.assert({
//       areas: [
//         {lat: 37, lng: 126},
//         {lat: 31, lng: 125},
//       ],
//     }) // ok

//     try {
//       validator.assert({
//         areas: [],
//       }) // fail
//     } catch (e) {
//       if (e instanceof safen.InvalidValueError) {
//         // output is :
//         // [ { reason: 'array_length_min:1@areas', message: 'The areas's length must be at least 1.' } ]
//         console.log(e.errors())
//       }
//     }
```

**Array With Range - Max**

```typescript
//     const validator = safen.create({
//       "areas[:2]": { // array
//         lat: "number",
//         lng: "number",
//       },
//     })

//     validator.assert({
//       areas: [
//         {lat: 31, lng: 125},
//       ],
//     }) // ok

//     validator.assert({
//       areas: [
//         {lat: 37, lng: 126},
//         {lat: 31, lng: 125},
//       ],
//     }) // ok

//     try {
//       validator.assert({
//         areas: [
//           {lat: 37, lng: 126},
//           {lat: 31, lng: 125},
//           {lat: 32, lng: 121},
//         ],
//       }) // fail
//     } catch (e) {
//       if (e instanceof safen.InvalidValueError) {
//         // output is :
//         // [ { reason: 'array_length_max:2@areas', message: 'The areas's length may not be greater than 2.' } ]
//         console.log(e.errors())
//       }
//     }
```

**Array With Range - Between**

```typescript
//     const validator = safen.create({
//       "areas[1:2]": { // array
//         lat: "number",
//         lng: "number",
//       },
//     })

//     validator.assert({
//       areas: [
//         {lat: 31, lng: 125},
//       ],
//     }) // ok

//     validator.assert({
//       areas: [
//         {lat: 37, lng: 126},
//         {lat: 31, lng: 125},
//       ],
//     }) // ok

//     try {
//       validator.assert({
//         areas: [],
//       }) // fail
//     } catch (e) {
//       if (e instanceof safen.InvalidValueError) {
//         // output is :
//         // [ { reason: 'array_length_between:1,2@areas', message: 'The areas's length must be between 1 and 2.' } ]
//         console.log(e.errors())
//       }
//     }

//     try {
//       validator.assert({
//         areas: [
//           {lat: 37, lng: 126},
//           {lat: 31, lng: 125},
//           {lat: 32, lng: 121},
//         ],
//       }) // fail
//     } catch (e) {
//       if (e instanceof safen.InvalidValueError) {
//         // output is :
//         // [ { reason: 'array_length_between:1,2@areas', message: 'The areas's length must be between 1 and 2.' } ]
//         console.log(e.errors())
//       }
//     }
```

**Array with Multi Dimension**

```typescript
//     const validator = safen.create({
//       "areas[][]": { // array
//         lat: "number",
//         lng: "number",
//       },
//     })

//     validator.assert({
//       areas: [
//         [
//           {lat: 37, lng: 126},
//           {lat: 31, lng: 125},
//         ],
//         [
//           {lat: 37, lng: 126},
//           {lat: 31, lng: 125},
//         ],
//       ],
//     }) // ok

//     try {
//       validator.assert({
//         areas: [
//           {lat: 37, lng: 126},
//           {lat: 31, lng: 125},
//         ],
//       }) // fail
//     } catch (e) {
//       if (e instanceof safen.InvalidValueError) {
//         // output is :
//         // [ { reason: 'array@areas[0]', message: 'The areas[0] must be an array.' },
//         //   { reason: 'array@areas[1]', message: 'The areas[1] must be an array.' } ]
//         console.log(e.errors())
//       }
//     }
```

## Custom Error Messages

If needed, you can add custom error messages.

```typescript
//     const validator = safen.create({
//       username: "email",
//     }, {
//       messages: {
//         email: [
//           "this is a custom message in :attribute.", // exist `:attribute`
//           "this is a custom message.", // no `:attribute`
//         ],
//       },
//     })

//     try {
//       validator.assert({
//         username: "corgidisco",
//       }) // fail
//     } catch (e) {
//       if (e instanceof safen.InvalidValueError) {
//         // output is :
//         // [ { reason: 'email@username', message: 'this is a custom message in username.' } ]
//         console.log(e.errors())
//       }
//     }
```

The `:attribute` will be replaced by field name. For example :

```typescript
//     const messages = {
//       required: ["The :attribute is required.", "It is required."],
//       between: ["The :attribute must be between :arg0 and :arg1.", "It must be between :arg0 and :arg1."],
//       in: ["The :attribute does not exist in :args.", "It does not exist in :args."],
//     }
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
**boolean**                   |                                         |
**boolean_string**            | alias `validator.isBoolean`             |
**buffer**                    |                                         |
**creditcard**                | alias `validator.isCreditCard`          |
**data_uri**                  | alias `validator.isDataURI`             |
**data_uri**                  | alias `validator.isDataURI`             |
**decimal_string**            | alias `validator.isDecimal`             |
**domain**                    | alias `validator.isFQDN`                |
**email**                     |                                         |
**finite**                    |                                         |
**float**                     |                                         |
**hash:{algorithm}**          | alias `validator.isHash`                | `hash:md4`, `hash:md5` ..
**hexcolor**                  | alias `validator.isHexColor`            |
**hexadecimal**               | alias `validator.isHexadecimal`         |
**in:{...args}**              | check if the value is in an array {args}| `in:1,2,3`
**int**                       |                                         |
**integer**                   |                                         |
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
**map**                       |                                         |
**max:{max}**                 | check if the value is less than {min}.  |
**min:{min}**                 | check if the value is greater than {max}. |
**mobilephone:{locale}**      | alias `validator.isMobilePhone`         |
**mongoid**                   | alias `validator.isMongoId`             |
**nan**                       |                                         |
**number**                    |                                         |
**number_string**             | alias `validator.isFloat`               |
**object**                    |                                         |
**postalcode:{locale}**       | alias `validator.isPostalCode`          |
**set**                       |                                         |
**string**                    |                                         |
**symbol**                    |                                         |
**uppercase**                 | alias `validator.isUppercase`           |
**url**                       | alias `validator.isURL`                 |
**uuid**                      | alias `validator.isUUID`                |


### validator validators

**Example**

```typescript
//     const validator = safen.create({
//       username: "validator.isEmail",
//     })

//     validator.assert({
//       username: "corgidisco@gmail.com",
//     }) // ok

//     try {
//       validator.assert({
//         username: "corgidisco",
//       }) // fail
//     } catch (e) {
//       if (e instanceof safen.InvalidValueError) {
//         // output is :
//         // [ { reason: 'validator.isEmail@username', message: 'An validator.isEmail error occured in username.' } ]
//         console.log(e.errors())
//       }
//     }
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


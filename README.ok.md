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

@code("./test/sample-typescript.test.ts@usage-default", "typescript")


## Rule Examples

### Pipe

@code("./test/sample-typescript.test.ts@sample-pipe", "typescript")

### Optional

@code("./test/sample-typescript.test.ts@sample-optional", "typescript")

### Object in Object

@code("./test/sample-typescript.test.ts@sample-object-in-object", "typescript")

### Array

**Simple Array**

@code("./test/sample-typescript.test.ts@sample-simple-array", "typescript")

**Array With Range - Fixed**

@code("./test/sample-typescript.test.ts@sample-array-with-range-fixed", "typescript")

**Array With Range - Min**

@code("./test/sample-typescript.test.ts@sample-array-with-range-min", "typescript")

**Array With Range - Max**

@code("./test/sample-typescript.test.ts@sample-array-with-range-max", "typescript")

**Array With Range - Between**

@code("./test/sample-typescript.test.ts@sample-array-with-range-between", "typescript")

**Array with Multi Dimension**

@code("./test/sample-typescript.test.ts@sample-array-with-multi-dims", "typescript")

## Custom Error Messages

If needed, you can add custom error messages.

@code("./test/sample-typescript.test.ts@sample-custom-error-messages", "typescript")

The `:attribute` will be replaced by field name. For example :

@code("./test/sample-typescript.test.ts@sample-custom-error-messages-examples", "typescript")

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

@code("./test/sample-typescript.test.ts@validator-validator", "typescript")

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


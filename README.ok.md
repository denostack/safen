# Safen

[![NPM](https://nodei.co/npm/safen.png)](https://nodei.co/npm/safen/)

Validator Library

## Install

```
npm install safen --save
```

## Usage

```js
import safen from "safen"

const validator = safen.create(/* rules */)

validator.assert(/* any values! */) // if it succeeds, nothing happens. if it failes, an exception occurs.
validator.validate(/* any values! */) // return boolean
 
```

## Rule Examples

### optional

@code("./test/index.test.ts@optional", "typescript")

### object in object

@code("./test/index.test.ts@object-in-object", "typescript")

### array

@code("./test/index.test.ts@array", "typescript")

@code("./test/index.test.ts@array-fixed", "typescript")

@code("./test/index.test.ts@array-multi-dim", "typescript")

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
**hash:{algorithm}**          | alias `validator.isHash`                | `hash:md4`, `hash:md5` ..
**hexcolor**                  | alias `validator.isHexColor`            |
**hexadecimal**               | alias `validator.isHexadecimal`         |
**in:{...args}**              | check if the value is in an array {args}| `in:1,2,3`
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

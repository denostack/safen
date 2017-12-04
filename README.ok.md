# Safen

[![NPM](https://nodei.co/npm/safen.png)](https://nodei.co/npm/safen/)

Validator Library Based on [lodash](https://github.com/lodash/lodash.js) and
[validator](https://github.com/chriso/validator.js)

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

@code("./test/samples.test.ts@optional", "typescript")

### object in object

@code("./test/samples.test.ts@object-in-object", "typescript")

### array

@code("./test/samples.test.ts@array", "typescript")

@code("./test/samples.test.ts@array-fixed", "typescript")

@code("./test/samples.test.ts@array-multi-dim", "typescript")

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

### lodash validators

**Example**

@code("./test/samples.test.ts@lodash-validator", "typescript")

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

@code("./test/samples.test.ts@validator-validator", "typescript")

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

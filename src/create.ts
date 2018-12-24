import { Rule, TesterMap } from "./interfaces/common"
import { alwaysFalseTester } from "./testers/always-false"
import { alwaysTrueTester } from "./testers/always-true"
import { betweenTester } from "./testers/between"
import { emailTester } from "./testers/email"
import { inTester } from "./testers/in"
import { intTester } from "./testers/int"
import { lengthTester } from "./testers/length"
import { lengthBetweenTester } from "./testers/length-between"
import { lengthMaxTester } from "./testers/length-max"
import { lengthMinTester } from "./testers/length-min"
import { maxTester } from "./testers/max"
import { minTester } from "./testers/min"
import { nullTester } from "./testers/null"
import { stringTester } from "./testers/string"
import { Validator } from "./validator/validator"


export interface CreateOptions {
  testers?: TesterMap
}

export function create(rule: Rule, {testers}: CreateOptions = {}): Validator {
  return new Validator(rule, testers || {
    // after: validatorTesters["validator.isAfter"],
    // alpha: validatorTesters["validator.isAlpha"],
    // alphanum: validatorTesters["validator.isAlphanumeric"],
    always_false: alwaysFalseTester,
    always_true: alwaysTrueTester,
    // ascii: validatorTesters["validator.isAscii"],

    // base64: validatorTesters["validator.isBase64"],
    // before: validatorTesters["validator.isBefore"],
    between: betweenTester,
    // boolean: lodashTesters["lodash.isBoolean"],
    // boolean_string: validatorTesters["validator.isBoolean"],
    // buffer: lodashTesters["lodash.isBuffer"],

    // creditcard: validatorTesters["validator.isCreditCard"],

    // data_uri: validatorTesters["validator.isDataURI"],
    // decimal_string: validatorTesters["validator.isDecimal"],
    // domain: validatorTesters["validator.isFQDN"],

    email: emailTester,

    // finite: lodashTesters["lodash.isFinite"],
    // float: lodashTesters["lodash.isNumber"],

    // hash: validatorTesters["validator.isHash"],
    // hexcolor: validatorTesters["validator.isHexColor"],
    // hexadecimal: validatorTesters["validator.isHexadecimal"],

    in: inTester,
    int: intTester,
    integer: intTester,
    // ip: validatorTesters["validator.isIP"],
    // isbn: validatorTesters["validator.isISBN"],
    // issn: validatorTesters["validator.isISSN"],
    // isin: validatorTesters["validator.isISIN"],
    // isrc: validatorTesters["validator.isISRC"],

    // json: validatorTesters["validator.isJSON"],

    // lowercase: validatorTesters["validator.isLowercase"],

    length: lengthTester,
    length_between: lengthBetweenTester,
    length_max: lengthMaxTester,
    length_min: lengthMinTester,

    // macaddress: validatorTesters["validator.isMACAddress"],
    // map: lodashTesters["lodash.isMap"],
    max: maxTester,
    min: minTester,
    // mobilephone: validatorTesters["validator.isMobilePhone"],
    // mongoid: validatorTesters["validator.isMongoId"],

    // nan: lodashTesters["lodash.isNaN"],
    null: nullTester,
    // number: lodashTesters["lodash.isNumber"],
    // number_string: validatorTesters["validator.isFloat"],

    // object: lodashTesters["lodash.isObject"],

    // postalcode: validatorTesters["validator.isPostalCode"],

    // set: lodashTesters["lodash.isSet"],
    string: stringTester,
    // symbol: lodashTesters["lodash.isSymbol"],

    // uppercase: validatorTesters["validator.isUppercase"],
    // url: validatorTesters["validator.isURL"],
    // uuid: validatorTesters["validator.isUUID"],
  })
}

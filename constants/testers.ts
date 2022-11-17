import { afterTester } from "../testers/after.ts";
import { alphaTester } from "../testers/alpha.ts";
import { alphanumTester } from "../testers/alphanum.ts";
import { alwaysFalseTester } from "../testers/always-false.ts";
import { alwaysTrueTester } from "../testers/always-true.ts";
import { anyTester } from "../testers/any.ts";
import { asciiTester } from "../testers/ascii.ts";
import { base64Tester } from "../testers/base64.ts";
import { beforeTester } from "../testers/before.ts";
import { betweenTester } from "../testers/between.ts";
import { booleanTester } from "../testers/boolean.ts";
import { creditcardTester } from "../testers/creditcard.ts";
import { dateTester } from "../testers/date.ts";
import { emailTester } from "../testers/email.ts";
import { falseTester } from "../testers/false.ts";
import { finiteTester } from "../testers/finite.ts";
import { hexcolorTester } from "../testers/hexcolor.ts";
import { inTester } from "../testers/in.ts";
import { intTester } from "../testers/int.ts";
import { ipTester } from "../testers/ip.ts";
import { jsonTester } from "../testers/json.ts";
import { jwtTester } from "../testers/jwt.ts";
import { lengthBetweenTester } from "../testers/length-between.ts";
import { lengthMaxTester } from "../testers/length-max.ts";
import { lengthMinTester } from "../testers/length-min.ts";
import { lengthTester } from "../testers/length.ts";
import { lowercaseTester } from "../testers/lowercase.ts";
import { macaddressTester } from "../testers/macaddress.ts";
import { maxTester } from "../testers/max.ts";
import { minTester } from "../testers/min.ts";
import { nanTester } from "../testers/nan.ts";
import { nullTester } from "../testers/null.ts";
import { numberTester } from "../testers/number.ts";
import { objectTester } from "../testers/object.ts";
import { portTester } from "../testers/port.ts";
import { regexpTester } from "../testers/regexp.ts";
import { stringTester } from "../testers/string.ts";
import { symbolTester } from "../testers/symbol.ts";
import { trueTester } from "../testers/true.ts";
import { uppercaseTester } from "../testers/uppercase.ts";
import { urlTester } from "../testers/url.ts";
import { uuidTester } from "../testers/uuid.ts";

export const testers = {
  after: afterTester,
  alpha: alphaTester,
  alphanum: alphanumTester,
  always_false: alwaysFalseTester,
  always_true: alwaysTrueTester,
  any: anyTester,
  ascii: asciiTester,

  base64: base64Tester,
  before: beforeTester,
  between: betweenTester,
  boolean: booleanTester,
  bool: booleanTester,

  creditcard: creditcardTester,

  date: dateTester,
  // datetime ?
  // domain

  email: emailTester,

  false: falseTester,
  finite: finiteTester,
  float: numberTester,

  // hash
  hexcolor: hexcolorTester,

  in: inTester,
  int: intTester,
  integer: intTester,
  ip: ipTester,

  json: jsonTester,
  jwt: jwtTester,

  lowercase: lowercaseTester,

  length: lengthTester,
  length_between: lengthBetweenTester,
  length_max: lengthMaxTester,
  length_min: lengthMinTester,

  macaddress: macaddressTester,
  max: maxTester,
  // microtimestamp
  min: minTester,

  nan: nanTester,
  null: nullTester,
  number: numberTester,

  object: objectTester,

  port: portTester,

  re: regexpTester,
  regex: regexpTester,
  regexp: regexpTester,

  string: stringTester,
  symbol: symbolTester,

  true: trueTester,
  // timestamp
  // timezone

  uppercase: uppercaseTester,
  url: urlTester,
  uuid: uuidTester,
};

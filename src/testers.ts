import { afterTester } from "./testers/after"
import { alphaTester } from "./testers/alpha"
import { alphanumTester } from "./testers/alphanum"
import { alwaysFalseTester } from "./testers/always-false"
import { alwaysTrueTester } from "./testers/always-true"
import { asciiTester } from "./testers/ascii"
import { base64Tester } from "./testers/base64"
import { beforeTester } from "./testers/before"
import { betweenTester } from "./testers/between"
import { booleanTester } from "./testers/boolean"
import { creditcardTester } from "./testers/creditcard"
import { dateTester } from "./testers/date"
import { emailTester } from "./testers/email"
import { finiteTester } from "./testers/finite"
import { hexcolorTester } from "./testers/hexcolor"
import { inTester } from "./testers/in"
import { intTester } from "./testers/int"
import { ipTester } from "./testers/ip"
import { jsonTester } from "./testers/json"
import { jwtTester } from "./testers/jwt"
import { lengthTester } from "./testers/length"
import { lengthBetweenTester } from "./testers/length-between"
import { lengthMaxTester } from "./testers/length-max"
import { lengthMinTester } from "./testers/length-min"
import { lowercaseTester } from "./testers/lowercase"
import { macaddressTester } from "./testers/macaddress"
import { maxTester } from "./testers/max"
import { minTester } from "./testers/min"
import { nanTester } from "./testers/nan"
import { nullTester } from "./testers/null"
import { numberTester } from "./testers/number"
import { portTester } from "./testers/port"
import { stringTester } from "./testers/string"
import { symbolTester } from "./testers/symbol"
import { uppercaseTester } from "./testers/uppercase"
import { urlTester } from "./testers/url"
import { uuidTester } from "./testers/uuid"

export const testers = {
  after: afterTester,
  alpha: alphaTester,
  alphanum: alphanumTester,
  always_false: alwaysFalseTester,
  always_true: alwaysTrueTester,
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

  port: portTester,

  // re

  string: stringTester,
  symbol: symbolTester,

  // timestamp
  // timezone

  uppercase: uppercaseTester,
  url: urlTester,
  uuid: uuidTester,
}

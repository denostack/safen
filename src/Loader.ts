
import * as _ from "lodash"
import * as types from "./types"

import AlwaysTrueTester from "./testers/AlwaysTrueTester"
import AlwaysFalseTester from "./testers/AlwaysFalseTester"
import BetweenTester from "./testers/BetweenTester"
import InTester from "./testers/InTester"
import LengthTester from "./testers/LengthTester"
import LengthBetweenTester from "./testers/LengthBetweenTester"
import LengthMaxTester from "./testers/LengthMaxTester"
import LengthMinTester from "./testers/LengthMinTester"
import MaxTester from "./testers/MaxTester"
import MinTester from "./testers/MinTester"

import {testers as lodashTesters} from "./testers/lodash-testers"
import {testers as validatorTesters} from "./testers/validator-testers"

export const defaultTesters = {
  after: validatorTesters["validator.isAfter"],
  alpha: validatorTesters["validator.isAlpha"],
  alphanum: validatorTesters["validator.isAlphanumeric"],
  always_false: AlwaysFalseTester,
  always_true: AlwaysTrueTester,
  ascii: validatorTesters["validator.isAscii"],

  base64: validatorTesters["validator.isBase64"],
  before: validatorTesters["validator.isBefore"],
  between: BetweenTester,
  boolean: lodashTesters["lodash.isBoolean"],
  boolean_string: validatorTesters["validator.isBoolean"],
  buffer: lodashTesters["lodash.isBuffer"],

  creditcard: validatorTesters["validator.isCreditCard"],

  data_uri: validatorTesters["validator.isDataURI"],
  decimal_string: validatorTesters["validator.isDecimal"],
  domain: validatorTesters["validator.isFQDN"],

  email: validatorTesters["validator.isEmail"],

  finite: lodashTesters["lodash.isFinite"],

  hash: validatorTesters["validator.isHash"],
  hexcolor: validatorTesters["validator.isHexColor"],
  hexadecimal: validatorTesters["validator.isHexadecimal"],

  in: InTester,
  integer: lodashTesters["lodash.isInteger"],
  ip: validatorTesters["validator.isIP"],
  isbn: validatorTesters["validator.isISBN"],
  issn: validatorTesters["validator.isISSN"],
  isin: validatorTesters["validator.isISIN"],
  isrc: validatorTesters["validator.isISRC"],

  json: validatorTesters["validator.isJSON"],

  lowercase: validatorTesters["validator.isLowercase"],

  length: LengthTester,
  length_between: LengthBetweenTester,
  length_max: LengthMaxTester,
  length_min: LengthMinTester,

  macaddress: validatorTesters["validator.isMACAddress"],
  map: lodashTesters["lodash.isMap"],
  max: MaxTester,
  min: MinTester,
  mobilephone: validatorTesters["validator.isMobilePhone"],
  mongoid: validatorTesters["validator.isMongoId"],

  nan: lodashTesters["lodash.isNaN"],
  number: lodashTesters["lodash.isNumber"],
  number_string: validatorTesters["validator.isFloat"],

  object: lodashTesters["lodash.isObject"],

  postalcode: validatorTesters["validator.isPostalCode"],

  set: lodashTesters["lodash.isSet"],
  string: lodashTesters["lodash.isString"],
  symbol: lodashTesters["lodash.isSymbol"],

  uppercase: validatorTesters["validator.isUppercase"],
  url: validatorTesters["validator.isURL"],
  uuid: validatorTesters["validator.isUUID"],
}

export default class Loader {

  private testers: types.TesterMap
  private caches: types.TesterCacheMap

  constructor(testers?: types.TesterMap) {
    this.testers = testers || Object.assign({}, defaultTesters, lodashTesters, validatorTesters)
    this.caches = {}
  }

  public load(tester: string): types.Tester {
    if (!(tester in this.caches)) {
      const [name, args] = this.getMethodAndParams(tester)
      this.caches[tester] = this.create(name, args)
    }
    return this.caches[tester]
  }

  public create(tester: string, args: any[]): types.Tester {
      const className = this.getClassName(tester)
      return new className(...args)
  }

  private getMethodAndParams(pattern: string): [string, any[]] {
    const pivot = pattern.indexOf(":")
    if (pivot === -1) {
      return [pattern, []]
    }
    return [
      _.trim(pattern.substr(0, pivot)),
      pattern.substr(pivot + 1).split(",").map(arg => _.trim(arg)).filter(arg => arg),
    ]
  }

  private getClassName(name: string): {new(): types.Tester} {
    if (name in this.testers) {
      return this.testers[name]
    }
    throw new Error(`tester not found : ${name}`)
  }
}


import * as _ from "lodash"
import * as types from "./types"

import AlwaysTrueTester from "./testers/AlwaysTrueTester"
import AlwaysFalseTester from "./testers/AlwaysFalseTester"
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

  before: validatorTesters["validator.isBefore"],
  boolean: lodashTesters["_.isBoolean"],
  buffer: lodashTesters["_.isBuffer"],

  email: validatorTesters["validator.isEmail"],

  finite: lodashTesters["_.isFinite"],

  integer: lodashTesters["_.isInteger"],

  length: LengthTester,
  length_between: LengthBetweenTester,
  length_max: LengthMaxTester,
  length_min: LengthMinTester,

  map: lodashTesters["_.isMap"],
  max: MaxTester,

  min: MinTester,

  nan: lodashTesters["_.isNaN"],
  number: lodashTesters["_.isNumber"],

  object: lodashTesters["_.isObject"],

  set: lodashTesters["_.isSet"],
  string: lodashTesters["_.isString"],
  symbol: lodashTesters["_.isSymbol"],
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

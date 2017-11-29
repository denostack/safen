
import * as types from "./types"

import AlwaysTrueTester from "./testers/AlwaysTrueTester"
import AlwaysFalseTester from "./testers/AlwaysFalseTester"
import EmailTester from "./testers/EmailTester"
import LengthTester from "./testers/LengthTester"
import LengthMaxTester from "./testers/LengthMaxTester"
import LengthMinTester from "./testers/LengthMinTester"
import MaxTester from "./testers/MaxTester"
import MinTester from "./testers/MinTester"

export const safenTesters = {
  always_false: AlwaysFalseTester,
  always_true: AlwaysTrueTester,
  email: EmailTester,
  length: LengthTester,
  length_max: LengthMaxTester,
  length_min: LengthMinTester,
  max: MaxTester,
  min: MinTester,
}

import * as _testers from "./testers/lodash-testers"

export const lodashTesters = {
  boolean: _testers.BooleanTester,
  buffer: _testers.BufferTester,
  finite: _testers.FiniteTester,
  integer: _testers.IntegerTester,
  map: _testers.MapTester,
  nan: _testers.NanTester,
  number: _testers.NumberTester,
  object: _testers.ObjectTester,
  set: _testers.SetTester,
  string: _testers.StringTester,
  symbol: _testers.SymbolTester,

  _arguments: _testers.ArgumentsTester,
  _array: _testers.ArrayTester,
  _array_buffer: _testers.ArrayBufferTester,
  _array_like: _testers.ArrayLikeTester,
  _array_like_object: _testers.ArrayLikeObjectTester,

  _boolean: _testers.BooleanTester,
  _buffer: _testers.BufferTester,

  _date: _testers.DateTester,

  _element: _testers.ElementTester,
  _empty: _testers.EmptyTester,
  _error: _testers.ErrorTester,

  _finite: _testers.FiniteTester,
  _function: _testers.FunctionTester,

  _integer: _testers.IntegerTester,

  _length: _testers.LengthTester,

  _map: _testers.MapTester,

  _nan: _testers.NanTester,
  _native: _testers.NativeTester,
  _nil: _testers.NilTester,
  _null: _testers.NullTester,
  _number: _testers.NumberTester,

  _object: _testers.ObjectTester,
  _object_like: _testers.ObjectLikeTester,

  _plain_object: _testers.PlainObjectTester,

  _regexp: _testers.RegExpTester,

  _safe_integer: _testers.SafeIntegerTester,
  _set: _testers.SetTester,
  _string: _testers.StringTester,
  _symbol: _testers.SymbolTester,

  _typed_array: _testers.TypedArrayTester,

  _undefined: _testers.UndefinedTester,

  _weak_map: _testers.WeakMapTester,
  _weak_set: _testers.WeakSetTester,
}

export default class Loader {

  private testers: types.TesterMap
  private caches: types.TesterCacheMap

  constructor(testers?: types.TesterMap) {
    this.testers = testers || Object.assign({}, safenTesters, lodashTesters)
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
    if (pattern.indexOf(":") === -1) {
      return [pattern, []]
    }
    const [method, argstr] = pattern.split(":")
    const args = argstr.split(",")
    return [method, args]
  }

  private getClassName(name: string): {new(): types.Tester} {
    if (name in this.testers) {
      return this.testers[name]
    }
    throw new Error(`tester not found : ${name}`)
  }
}

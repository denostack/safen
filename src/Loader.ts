
import * as types from "./types"

import AlwaysTrueTester from "./testers/AlwaysTrueTester"
import AlwaysFalseTester from "./testers/AlwaysFalseTester"
import EmailTester from "./testers/EmailTester"
import * as _testers from "./testers/lodash-testers"

export const lodashTesters = {
  arguments: _testers.ArgumentsTester,
  array: _testers.ArrayTester,
  array_buffer: _testers.ArrayBufferTester,
  array_like: _testers.ArrayLikeTester,
  array_like_object: _testers.ArrayLikeObjectTester,

  boolean: _testers.BooleanTester,
  buffer: _testers.BufferTester,

  date: _testers.DateTester,

  element: _testers.ElementTester,
  empty: _testers.EmptyTester,
  error: _testers.ErrorTester,

  finite: _testers.FiniteTester,
  function: _testers.FunctionTester,

  integer: _testers.IntegerTester,

  length: _testers.LengthTester,

  map: _testers.MapTester,

  nan: _testers.NanTester,
  native: _testers.NativeTester,
  nil: _testers.NilTester,
  null: _testers.NullTester,
  number: _testers.NumberTester,

  object: _testers.ObjectTester,
  object_like: _testers.ObjectLikeTester,

  plain_object: _testers.PlainObjectTester,

  regexp: _testers.RegExpTester,

  safe_integer: _testers.SafeIntegerTester,
  set: _testers.SetTester,
  string: _testers.StringTester,
  symbol: _testers.SymbolTester,

  typed_array: _testers.TypedArrayTester,

  undefined: _testers.UndefinedTester,

  weak_map: _testers.WeakMapTester,
  weak_set: _testers.WeakSetTester,
}

export default class Loader {

  private testers: types.TesterMap
  private caches: types.TesterCacheMap

  constructor(testers?: types.TesterMap) {
    this.testers = testers || Object.assign({
      always_false: AlwaysFalseTester,
      always_true: AlwaysTrueTester,
      email: EmailTester,
    }, lodashTesters)
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

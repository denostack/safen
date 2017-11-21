
import * as types from "../types"
import * as _ from "lodash"

function gen(handler: (value: any) => boolean): {new(): types.Tester} {
  class LodashTester implements types.Tester {
    public test(data: any): boolean {
      return handler(data)
    }
  }
  return LodashTester
}

export const ArgumentsTester = gen(_.isArguments)
export const ArrayTester = gen(_.isArray)
export const ArrayBufferTester = gen(_.isArrayBuffer)
export const ArrayLikeTester = gen(_.isArrayLike)
export const ArrayLikeObjectTester = gen(_.isArrayLikeObject)

export const BooleanTester = gen(_.isBoolean)
export const BufferTester = gen(_.isBuffer)

export const DateTester = gen(_.isDate)

export const ElementTester = gen(_.isElement)
export const EmptyTester = gen(_.isEmpty)
export const ErrorTester = gen(_.isError)

export const FiniteTester = gen(_.isFinite)
export const FunctionTester = gen(_.isFunction)

export const IntegerTester = gen(_.isInteger)

export const LengthTester = gen(_.isLength)

export const MapTester = gen(_.isMap)

export const NanTester = gen(_.isNaN)
export const NativeTester = gen(_.isNative)
export const NilTester = gen(_.isNil)
export const NullTester = gen(_.isNull)
export const NumberTester = gen(_.isNumber)

export const ObjectTester = gen(_.isObject)
export const ObjectLikeTester = gen(_.isObjectLike)

export const PlainObjectTester = gen(_.isPlainObject)

export const RegExpTester = gen(_.isRegExp)

export const SafeIntegerTester = gen(_.isSafeInteger)
export const SetTester = gen(_.isSet)
export const StringTester = gen(_.isString)
export const SymbolTester = gen(_.isSymbol)

export const TypedArrayTester = gen(_.isTypedArray)

export const UndefinedTester = gen(_.isUndefined)

export const WeakMapTester = gen(_.isWeakMap)
export const WeakSetTester = gen(_.isWeakSet)


import "jest"

import {MapLoader as TesterLoader} from "../dist/tester-loader/MapLoader"
import {Validator} from "../dist/Validator"
import {InvalidValueError} from "../dist/InvalidValueError"
import * as types from "../dist/types"
import {AlwaysFalseTester} from "../dist/testers/AlwaysFalseTester"

describe("Validator.assert", () => {

  const alwaysTrue = new Validator("always_true")
  const alwaysFalse = new Validator("always_false")

  it("assert nothing", () => {
    expect.assertions(0)
    alwaysTrue.assert("string~")
    alwaysTrue.assert(null)
  })

  it("assert", () => {
    expect.assertions(2)
    try {
      alwaysFalse.assert("string~")
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidValueError)
      expect((e as InvalidValueError).getErrors()).toEqual([
        "always_false",
      ])
    }
  })
})

describe("Validator.validate", () => {

  const alwaysTrue = new Validator("always_true")
  const alwaysFalse = new Validator("always_false")

  it("success", () => {
    expect.assertions(2)
    expect(alwaysTrue.validate("string~")).toBe(true)
    expect(alwaysTrue.validate(null)).toBe(true)
  })

  it("fail", () => {
    expect.assertions(2)
    expect(alwaysFalse.validate("string~")).toBe(false)
    expect(alwaysFalse.validate(null)).toBe(false)
  })
})

describe("Tester.before", () => {

  class AlwaysTrueButHasBefore implements types.Tester {
    public before(): Array<[{new(): types.Tester}, any[]] | {new(): types.Tester}> {
      return [
        AlwaysFalseTester,
      ]
    }
    public test(data: any): boolean {
      return true
    }
  }

  const validator = new Validator("custom_tester", new TesterLoader({custom_tester: AlwaysTrueButHasBefore}))

  it("assert nothing", () => {
    expect(validator.validate([1, 2, 3])).toBe(false) // before return false
  })
})

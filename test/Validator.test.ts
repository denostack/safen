
import {} from "jest"

import Loader from "../dist/Loader"
import Validator from "../dist/Validator"
import InvalidValueError from "../dist/InvalidValueError"

describe("Validator.assert", () => {

  const alwaysTrue = new Validator(new Loader(), "always_true")
  const alwaysFalse = new Validator(new Loader(), "always_false")

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

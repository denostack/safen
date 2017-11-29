
import {} from "jest"

import safen from "../dist"
import {InvalidValueError} from "../dist"

describe("safen.create", () => {
  it("success", () => {
    const validator = safen.create("always_true")
    expect(validator.validate("")).toBe(true)
  })

  it("fail", () => {
    const validator = safen.create("always_false")
    expect(validator.validate("")).toBe(false)
  })

  it("sample1", () => {
    expect.assertions(0)

    // section:sample1
    const validator = safen.create({
      "username": "string|length:4,20",
      "password?": "length:8,20",
    })

    validator.assert({
      username: "username",
    }) // ok

    validator.assert({
      username: "wan2land",
      password: "password!@#",
    }) // ok
    // endsection
  })
})

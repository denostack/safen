
import {} from "jest"

import * as safen from "../dist"

describe("safen.create", () => {
  it("success", () => {
    const validator = safen.create("always_true")
    expect(validator.validate("")).toBe(true)
  })

  it("fail", () => {
    const validator = safen.create("always_false")
    expect(validator.validate("")).toBe(false)
  })
})

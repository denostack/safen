
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
      "username": "string|length_between:4,20",
      "password?": "length_between:8,20",
    })

    validator.assert({
      username: "username",
    }) // ok

    validator.assert({
      username: "corgidisco",
      password: "password!@#",
    }) // ok
    // endsection
  })
})

describe("load all testers", () => {
  it("test after", () => {
    expect(safen.create("after:2017-12-01 00:00:01").validate("2017-12-01 00:00:02")).toBe(true)
    expect(safen.create("after:2017-12-01 00:00:01").validate("2017-12-01 00:00:00")).toBe(false)
    expect(safen.create("after:2017-12-01 00:00:01").validate("2017-12-01 00:00:01")).toBe(false)
  })

  it("test alpha", () => {
    expect(safen.create("alpha").validate("abcdefghijklmnopqrstuvwxyz")).toBe(true)
    expect(safen.create("alpha").validate("1")).toBe(false)
    expect(safen.create("alpha").validate("äbc")).toBe(false)
    expect(safen.create("alpha:de-DE").validate("äbc")).toBe(true)
    expect(safen.create("alpha:de-DE").validate("äbc1")).toBe(false)
  })

  it("test alphanum", () => {
    expect(safen.create("alphanum").validate("abcdefghijklmnopqrstuvwxyz1")).toBe(true)
    expect(safen.create("alphanum").validate("1")).toBe(true)
    expect(safen.create("alphanum").validate("äbc1")).toBe(false)
    expect(safen.create("alphanum:de-DE").validate("äbc1")).toBe(true)
  })

  it("test email", () => {
    expect.assertions(4)
    expect(safen.create("email").validate("corgidisco@gmail.com")).toBe(true)
    expect(safen.create("email").validate("corgidisco+en@gmail.com")).toBe(true)
    expect(safen.create("email").validate("corgi.disco@gmail.com")).toBe(true)
    expect(safen.create("email").validate("corgidisco")).toBe(false)
  })
})

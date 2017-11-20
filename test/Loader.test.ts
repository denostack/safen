
import {} from "jest"

import Loader from "../dist/Loader"
import AlwaysTrueTester from "../dist/testers/AlwaysTrueTester"
import AlwaysFalseTester from "../dist/testers/AlwaysFalseTester"

describe("Loader.create", () => {

  const loader = new Loader()

  it("success", () => {
    expect.assertions(2)
    expect(loader.create("always_true", [])).toBeInstanceOf(AlwaysTrueTester)
    expect(loader.create("always_false", [])).toBeInstanceOf(AlwaysFalseTester)
  })
})

describe("Loader.load", () => {

  const loader = new Loader()

  it("test caches", () => {
    expect.assertions(1)

    const alwaysTrueTester = loader.load("always_true")

    expect(loader.load("always_true")).toBe(alwaysTrueTester) // same
  })
})

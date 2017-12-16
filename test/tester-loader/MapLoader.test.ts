
import "jest"

import {MapLoader as TesterLoader} from "../../dist/tester-loader/MapLoader"
import {AlwaysTrueTester} from "../../dist/testers/AlwaysTrueTester"
import {AlwaysFalseTester} from "../../dist/testers/AlwaysFalseTester"

describe("TesterLoader.create", () => {

  const testerLoader = new TesterLoader()

  it("success", () => {
    expect.assertions(2)
    expect(testerLoader.create("always_true", [])).toBeInstanceOf(AlwaysTrueTester)
    expect(testerLoader.create("always_false", [])).toBeInstanceOf(AlwaysFalseTester)
  })
})

describe("TesterLoader.load", () => {

  const testerLoader = new TesterLoader()

  it("test caches", () => {
    expect.assertions(1)

    const alwaysTrueTester = testerLoader.load("always_true")

    expect(testerLoader.load("always_true")).toBe(alwaysTrueTester) // same
  })
})

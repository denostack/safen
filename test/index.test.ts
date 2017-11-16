
import {} from "jest"

import * as prevent from "../dist/index"

describe("hello world", () => {
  it("default load success", () => {
    expect.assertions(1)
    expect(prevent.hello()).toEqual("hello world!")
  })
})

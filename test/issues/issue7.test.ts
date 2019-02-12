import "jest"

import { create } from "../../src/index"

function createError(message: string, code: string) {
  return Object.assign(new Error(message), {
    code,
  })
}

describe("issue #7", () => {
  it("test scalar success", () => {
    expect(() => create("unknown")).toThrowError(createError("Undefined Error: \"unknown\" is an undefined tester.", "UNDEFINED_ERROR"))
  })
})


import "jest"

import {MapLoader} from "../../dist/message-loader/MapLoader"

describe("MapLoader", () => {

  const loader = new MapLoader({
    always_false: "This value is always false.",
    required: ["The :attribute field is required.", "It is required."],
    something: [":attribute :arguments0 :arguments1 :tester", ":arguments0 :arguments1 :tester"],
  })

  it("test string message", () => {
    expect(loader.load("always_false")).toEqual("This value is always false.")
    expect(loader.load("always_false@user.name")).toEqual("This value is always false.")
  })

  it("test tuple message", () => {
    expect(loader.load("required")).toEqual("It is required.")
    expect(loader.load("required@user.name")).toEqual("The user.name field is required.")
  })

  it("test unknown message", () => {
    expect(loader.load("unknown")).toEqual("Something is wrong.")
    expect(loader.load("unknown@user.name")).toEqual("Something is wrong.")
  })

  it("test template", () => {
    expect(loader.load("something:1,2,3")).toEqual("1 2 something")
    expect(loader.load("something:1,2,3@user.name")).toEqual("user.name 1 2 something")
  })
})

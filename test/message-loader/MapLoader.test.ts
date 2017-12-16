
import "jest"

import {MapLoader} from "../../dist/message-loader/MapLoader"

describe("MapLoader", () => {

  const loader = new MapLoader({
    always_false: "This value is always false.",
    required: ["The :attribute field is required.", "It is required."],
    something: [":attribute :arg0 :arg1 :tester", ":arg0 :arg1 :tester"],
    in: ["The :attribute does not exist in :args.", "It does not exist in :args."],
  })

  it("test string message", () => {
    expect(loader.load("always_false")).toEqual("This value is always false.")
    expect(loader.load("always_false@user.name")).toEqual("This value is always false.")
  })

  it("test tuple message", () => {
    expect(loader.load("required")).toEqual("It is required.")
    expect(loader.load("required@user.name")).toEqual("The user.name field is required.")
  })

  it("test string message", () => {
    expect(loader.load("in:abc,def,ghi")).toEqual("It does not exist in abc, def, ghi.")
    expect(loader.load("in:abc,def,ghi@user.name")).toEqual("The user.name does not exist in abc, def, ghi.")
  })

  it("test unknown message", () => {
    expect(loader.load("unknown")).toEqual("An unknown error occured.")
    expect(loader.load("unknown@user.name")).toEqual("An unknown error occured in user.name.")
  })

  it("test template", () => {
    expect(loader.load("something:1,2,3")).toEqual("1 2 something")
    expect(loader.load("something:1,2,3@user.name")).toEqual("user.name 1 2 something")
  })
})

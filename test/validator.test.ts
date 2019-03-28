import "jest"
import { expectThrow } from "./utils"
import * as safen from "../lib"

describe("default validator testsuite", () => {

  it("test scalar", () => {
    const v = safen.create("string")

    expect(v.validate("string")).toBeTruthy()

    expect(v.validate(null)).toBeFalsy()
    expect(v.validate(undefined)).toBeFalsy()
    expect(v.validate([])).toBeFalsy()
    expect(v.validate({})).toBeFalsy()

    expect(v.assert("string")).toEqual("string")

    expectThrow(() => v.assert(null), [{path: "", reason: "string", params: [], message: "It must be a string."}])
    expectThrow(() => v.assert(undefined), [{path: "", reason: "string", params: [], message: "It must be a string."}])
    expectThrow(() => v.assert([]), [{path: "", reason: "string", params: [], message: "It must be a string."}])
    expectThrow(() => v.assert({}), [{path: "", reason: "string", params: [], message: "It must be a string."}])
  })

  it("test and", () => {
    const v = safen.create("string & email")
    
    expect(v.validate("corgidisco@gmail.com")).toBeTruthy()

    expect(v.validate("corgidisco")).toBeFalsy()
    expect(v.validate(null)).toBeFalsy()
    expect(v.validate(undefined)).toBeFalsy()
    expect(v.validate([])).toBeFalsy()
    expect(v.validate({})).toBeFalsy()

    expect(v.assert("corgidisco@gmail.com")).toEqual("corgidisco@gmail.com")

    expectThrow(() => v.assert("string"), [{path: "", reason: "email", params: [], message: "It must be a valid email address."}])
    expectThrow(() => v.assert(null), [{path: "", reason: "string", params: [], message: "It must be a string."}])
    expectThrow(() => v.assert(undefined), [{path: "", reason: "string", params: [], message: "It must be a string."}])
    expectThrow(() => v.assert([]), [{path: "", reason: "string", params: [], message: "It must be a string."}])
    expectThrow(() => v.assert({}), [{path: "", reason: "string", params: [], message: "It must be a string."}])
  })

  it("test or", () => {
    const v = safen.create("string | number")

    expect(v.validate("corgidisco")).toBeTruthy()
    expect(v.validate(10)).toBeTruthy()
    expect(v.validate(3.141592)).toBeTruthy()

    expect(v.validate(undefined)).toBeFalsy()
    expect(v.validate(null)).toBeFalsy()
    expect(v.validate(true)).toBeFalsy()
    expect(v.validate(false)).toBeFalsy()
    expect(v.validate([])).toBeFalsy()
    expect(v.validate({})).toBeFalsy()

    expect(v.assert("corgidisco")).toEqual("corgidisco")
    expect(v.assert(10)).toEqual(10)
    expect(v.assert(3.141592)).toEqual(3.141592)

    expectThrow(() => v.assert(undefined), [
      {path: "", reason: "string", params: [], message: "It must be a string."},
      {path: "", reason: "number", params: [], message: "It must be a number."},
    ])
    expectThrow(() => v.assert(null), [
      {path: "", reason: "string", params: [], message: "It must be a string."},
      {path: "", reason: "number", params: [], message: "It must be a number."},
    ])
    expectThrow(() => v.assert(true), [
      {path: "", reason: "string", params: [], message: "It must be a string."},
      {path: "", reason: "number", params: [], message: "It must be a number."},
    ])
    expectThrow(() => v.assert(false), [
      {path: "", reason: "string", params: [], message: "It must be a string."},
      {path: "", reason: "number", params: [], message: "It must be a number."},
    ])
    expectThrow(() => v.assert([]), [
      {path: "", reason: "string", params: [], message: "It must be a string."},
      {path: "", reason: "number", params: [], message: "It must be a number."},
    ])
    expectThrow(() => v.assert({}), [
      {path: "", reason: "string", params: [], message: "It must be a string."},
      {path: "", reason: "number", params: [], message: "It must be a number."},
    ])
  })

  it("test object", () => {
    const v = safen.create(`{
      username: string
    }`)

    expect(v.validate({username: "corgidisco"})).toBeTruthy()

    expect(v.validate({})).toBeFalsy()
    expect(v.validate({username: undefined})).toBeFalsy()
    expect(v.validate({username: null})).toBeFalsy()
    expect(v.validate({username: true})).toBeFalsy()
    expect(v.validate({username: false})).toBeFalsy()
    expect(v.validate({username: 10})).toBeFalsy()
    expect(v.validate({username: 3.141592})).toBeFalsy()
    expect(v.validate({username: []})).toBeFalsy()
    expect(v.validate({username: {}})).toBeFalsy()

    expect(v.assert({username: "corgidisco"})).toEqual({username: "corgidisco"})

    expectThrow(() => v.assert({}), [{path: "username", reason: "required", params: [], message: "The username is required."}])
    expectThrow(() => v.assert({username: undefined}), [{path: "username", reason: "required", params: [], message: "The username is required."}])
    expectThrow(() => v.assert({username: null}), [{path: "username", reason: "string", params: [], message: "The username must be a string."}])

    expectThrow(() => v.assert({username: []}), [{path: "username", reason: "string", params: [], message: "The username must be a string."}])
    expectThrow(() => v.assert({username: ["corgidisco"]}), [{path: "username", reason: "string", params: [], message: "The username must be a string."}])
  })

  it("test array", () => {
    const v = safen.create(`{
      usernames: string[]
    }`)

    expect(v.validate({usernames: []})).toBeTruthy()
    expect(v.validate({usernames: ["corgidisco"]})).toBeTruthy()

    expect(v.validate({})).toBeFalsy()
    expect(v.validate({usernames: undefined})).toBeFalsy()
    expect(v.validate({usernames: null})).toBeFalsy()
    expect(v.validate({usernames: true})).toBeFalsy()
    expect(v.validate({usernames: false})).toBeFalsy()
    expect(v.validate({usernames: "corgidisco"})).toBeFalsy()
    expect(v.validate({usernames: 10})).toBeFalsy()
    expect(v.validate({usernames: 3.141592})).toBeFalsy()
    expect(v.validate({usernames: {}})).toBeFalsy()

    expect(v.assert({usernames: []})).toEqual({usernames: []})
    expect(v.assert({usernames: ["user1"]})).toEqual({usernames: ["user1"]})

    expectThrow(() => v.assert({}), [{path: "usernames", reason: "required", params: [], message: "The usernames is required."}])
    expectThrow(() => v.assert({usernames: undefined}), [{path: "usernames", reason: "required", params: [], message: "The usernames is required."}])
    expectThrow(() => v.assert({usernames: null}), [{path: "usernames", reason: "array", params: [], message: "The usernames must be an array."}])
    expectThrow(() => v.assert({usernames: "user1"}), [{path: "usernames", reason: "array", params: [], message: "The usernames must be an array."}])
  })

  it("test object optional", () => {
    const v = safen.create(`{
      username?: string
    }`)

    expect(v.validate({})).toBeTruthy()
    expect(v.validate({username: undefined})).toBeTruthy()
    expect(v.validate({username: "user1"})).toBeTruthy()

    expect(v.validate(undefined)).toBeFalsy()
    expect(v.validate(null)).toBeFalsy()
    expect(v.validate(true)).toBeFalsy()
    expect(v.validate(false)).toBeFalsy()
    expect(v.validate("string")).toBeFalsy()
    expect(v.validate(3.141592)).toBeFalsy()
    expect(v.validate({username: null})).toBeFalsy()
    expect(v.validate({username: []})).toBeFalsy()
    expect(v.validate({username: ["user1"]})).toBeFalsy()

    expect(v.assert({})).toEqual({})
    expect(v.assert({username: undefined})).toEqual({username: undefined})
    expect(v.assert({username: "user1"})).toEqual({username: "user1"})

    expectThrow(() => v.assert(undefined),  [{path: "", reason: "object", params: [], message: "It must be an object."}])
    expectThrow(() => v.assert(null),  [{path: "", reason: "object", params: [], message: "It must be an object."}])
    expectThrow(() => v.assert(true),  [{path: "", reason: "object", params: [], message: "It must be an object."}])
    expectThrow(() => v.assert(false),  [{path: "", reason: "object", params: [], message: "It must be an object."}])
    expectThrow(() => v.assert("string"),  [{path: "", reason: "object", params: [], message: "It must be an object."}])
    expectThrow(() => v.assert(3.141592),  [{path: "", reason: "object", params: [], message: "It must be an object."}])
    expectThrow(() => v.assert({username: null}), [{path: "username", reason: "string", params: [], message: "The username must be a string."}])
    expectThrow(() => v.assert({username: []}), [{path: "username", reason: "string", params: [], message: "The username must be a string."}])
    expectThrow(() => v.assert({username: ["user1"]}), [{path: "username", reason: "string", params: [], message: "The username must be a string."}])
  })

  it("test object optional array", () => {
    const v = safen.create(`{
      usernames?: string[]
    }`)


    expect(v.validate({})).toBeTruthy()
    expect(v.validate({usernames: undefined})).toBeTruthy()
    expect(v.validate({usernames: []})).toBeTruthy()
    expect(v.validate({usernames: ["user1"]})).toBeTruthy()

    expect(v.validate({usernames: null})).toBeFalsy()
    expect(v.validate({usernames: "user1"})).toBeFalsy()

    expect(v.assert({})).toEqual({})
    expect(v.assert({usernames: undefined})).toEqual({usernames: undefined})
    expect(v.assert({usernames: []})).toEqual({usernames: []})
    expect(v.assert({usernames: ["user1"]})).toEqual({usernames: ["user1"]})

    expectThrow(() => v.assert({usernames: null}), [{path: "usernames", reason: "array", params: [], message: "The usernames must be an array."}])
    expectThrow(() => v.assert({usernames: "user1"}), [{path: "usernames", reason: "array", params: [], message: "The usernames must be an array."}])
  })

  it("test array length", () => {
    const v = safen.create(`{
      usernames: string[2]
    }`)

    expect(v.validate({usernames: ["1", "2"]})).toBeTruthy()

    expect(v.validate({usernames: []})).toBeFalsy()
    expect(v.validate({usernames: ["1"]})).toBeFalsy()
    expect(v.validate({usernames: ["1", "2", "3"]})).toBeFalsy()

    expect(v.assert({usernames: ["1", "2"]})).toEqual({usernames: ["1", "2"]})

    expectThrow(() => v.assert({usernames: []}), [{path: "usernames", reason: "array_length", params: [2], message: "The usernames's length must be 2."}])
    expectThrow(() => v.assert({usernames: ["1"]}), [{path: "usernames", reason: "array_length", params: [2], message: "The usernames's length must be 2."}])
    expectThrow(() => v.assert({usernames: ["1", "2", "3"]}), [{path: "usernames", reason: "array_length", params: [2], message: "The usernames's length must be 2."}])
  })

  it("test array length max", () => {
    const v = safen.create(`{
      usernames: string[:2]
    }`)

    expect(v.validate({usernames: []})).toBeTruthy()
    expect(v.validate({usernames: ["1"]})).toBeTruthy()
    expect(v.validate({usernames: ["1", "2"]})).toBeTruthy()

    expect(v.validate({usernames: ["1", "2", "3"]})).toBeFalsy()

    expect(v.assert({usernames: []})).toEqual({usernames: []})
    expect(v.assert({usernames: ["1"]})).toEqual({usernames: ["1"]})
    expect(v.assert({usernames: ["1", "2"]})).toEqual({usernames: ["1", "2"]})

    expectThrow(() => v.assert({usernames: ["1", "2", "3"]}), [{path: "usernames", reason: "array_length_max", params: [2], message: "The usernames's length may not be greater than 2."}])
  })

  it("test array length min", () => {
    const v = safen.create(`{
      usernames: string[2:]
    }`)

    expect(v.validate({usernames: ["1", "2"]})).toBeTruthy()
    expect(v.validate({usernames: ["1", "2", "3"]})).toBeTruthy()

    expect(v.validate({usernames: []})).toBeFalsy()
    expect(v.validate({usernames: ["1"]})).toBeFalsy()

    expect(v.assert({usernames: ["1", "2"]})).toEqual({usernames: ["1", "2"]})
    expect(v.assert({usernames: ["1", "2", "3"]})).toEqual({usernames: ["1", "2", "3"]})

    expectThrow(() => v.assert({usernames: []}), [{path: "usernames", reason: "array_length_min", params: [2], message: "The usernames's length must be at least 2."}])
    expectThrow(() => v.assert({usernames: ["1"]}), [{path: "usernames", reason: "array_length_min", params: [2], message: "The usernames's length must be at least 2."}])
  })

  it("test array length between", () => {
    const v = safen.create(`{
      usernames: string[1:2]
    }`)

    expect(v.validate({usernames: ["1"]})).toBeTruthy()
    expect(v.validate({usernames: ["1", "2"]})).toBeTruthy()

    expect(v.validate({usernames: []})).toBeFalsy()
    expect(v.validate({usernames: ["1", "2", "3"]})).toBeFalsy()

    expect(v.assert({usernames: ["1"]})).toEqual({usernames: ["1"]})
    expect(v.assert({usernames: ["1", "2"]})).toEqual({usernames: ["1", "2"]})

    expectThrow(() => v.assert({usernames: []}), [{path: "usernames", reason: "array_length_between", params: [1, 2], message: "The usernames's length must be between 1 and 2."}])
    expectThrow(() => v.assert({usernames: ["1", "2", "3"]}), [{path: "usernames", reason: "array_length_between", params: [1, 2], message: "The usernames's length must be between 1 and 2."}])
  })

  it(`test array multi depth`, () => {
    const v = safen.create(`{
      name: string[2][3]
    }`)

    expect(v.validate({name: [["a1", "a2"], ["a1", "a2"], ["a1", "a2"]]})).toBeTruthy()

    expect(v.validate({name: null})).toBeFalsy()
    expect(v.validate({name: 10})).toBeFalsy()
    expect(v.validate({name: true})).toBeFalsy()
    expect(v.validate({name: false})).toBeFalsy()
    expect(v.validate({name: "string"})).toBeFalsy()
    expect(v.validate({name: [["a1", "a2", "a3"], ["a1", "a2", "a3"]]})).toBeFalsy()

    expect(v.assert({name: [["a1", "a2"], ["a1", "a2"], ["a1", "a2"]]})).toEqual({name: [["a1", "a2"], ["a1", "a2"], ["a1", "a2"]]})

    expectThrow(() => v.assert({name: null}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: 10}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: true}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: false}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: "string"}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: [["a1", "a2", "a3"], ["a1", "a2", "a3"]]}), [{path: "name", reason: "array_length", params: [3], message: "The name's length must be 3."}])
    expectThrow(() => v.assert({name: [["a1", "a2"], ["a1", "a2", "a3"], ["a1", "a2"]]}), [{path: "name[1]", reason: "array_length", params: [2], message: "The name[1]'s length must be 2."}])
  })

  it(`test object and complex condition`, () => {
    const v = safen.create(`{
      name: (string & email) | null,
    }`)

    expect(v.validate({name: "corgidisco@gmail.com"})).toBeTruthy()
    expect(v.validate({name: null})).toBeTruthy()

    expect(v.validate({name: 10})).toBeFalsy()
    expect(v.validate({name: true})).toBeFalsy()
    expect(v.validate({name: false})).toBeFalsy()
    expect(v.validate({name: "string"})).toBeFalsy()

    expect(v.assert({name: "corgidisco@gmail.com"})).toEqual({name: "corgidisco@gmail.com"})
    expect(v.assert({name: null})).toEqual({name: null})

    expectThrow(() => v.assert({name: 10}), [
      {path: "name", reason: "string", params: [], message: "The name must be a string."},
      {path: "name", reason: "null", params: [], message: "The name must be a null."},
    ])
    expectThrow(() => v.assert({name: true}), [
      {path: "name", reason: "string", params: [], message: "The name must be a string."},
      {path: "name", reason: "null", params: [], message: "The name must be a null."},
    ])
    expectThrow(() => v.assert({name: false}), [
      {path: "name", reason: "string", params: [], message: "The name must be a string."},
      {path: "name", reason: "null", params: [], message: "The name must be a null."},
    ])
    expectThrow(() => v.assert({name: "string"}), [
      {path: "name", reason: "email", params: [], message: "The name must be a valid email address."},
      {path: "name", reason: "null", params: [], message: "The name must be a null."},
    ])
  })

  it(`test object and complex condition array`, () => {
    const v = safen.create(`{
      name: ((string & email) | null)[]
    }`)

    expect(v.validate({name: ["corgidisco@gmail.com", "corgidisco2@gmail.com"]})).toBeTruthy()
    expect(v.validate({name: []})).toBeTruthy()

    expect(v.validate({name: 10})).toBeFalsy()
    expect(v.validate({name: true})).toBeFalsy()
    expect(v.validate({name: false})).toBeFalsy()
    expect(v.validate({name: "string"})).toBeFalsy()

    expect(v.assert({name: ["corgidisco@gmail.com", "corgidisco2@gmail.com"]})).toEqual({name: ["corgidisco@gmail.com", "corgidisco2@gmail.com"]})
    expect(v.assert({name: []})).toEqual({name: []})

    expectThrow(() => v.assert({name: 10}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: true}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: false}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: "string"}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
  })

  it(`test object multi depth`, () => {
    const v = safen.create(`{
      name: string,
      location: {
        lat: int,
        lng: int,
      },
    }`)

    expect(v.validate({name: "corgidisco", location: {lat: 10, lng: 20}})).toBeTruthy()

    expect(v.validate({name: "corgidisco"})).toBeFalsy()
    expect(v.validate({name: "corgidisco", location: null})).toBeFalsy()
    expect(v.validate({name: "corgidisco", location: true})).toBeFalsy()
    expect(v.validate({name: "corgidisco", location: false})).toBeFalsy()
    expect(v.validate({name: "corgidisco", location: "string"})).toBeFalsy()
    expect(v.validate({name: "corgidisco", location: 3.141592})).toBeFalsy()
    expect(v.validate({name: "corgidisco", location: {lat: "10", lng: 20}})).toBeFalsy()
    expect(v.validate({name: "corgidisco", location: {lat: 10, lng: "20"}})).toBeFalsy()
    expect(v.validate({name: "corgidisco", location: {lat: 10.3, lng: 20}})).toBeFalsy()
    expect(v.validate({name: "corgidisco", location: {lat: 10, lng: 20.5}})).toBeFalsy()
    expect(v.validate({name: "corgidisco", location: {}})).toBeFalsy()

    expect(v.assert({name: "corgidisco", location: {lat: 10, lng: 20}})).toEqual({name: "corgidisco", location: {lat: 10, lng: 20}})

    expectThrow(() => v.assert({name: "corgidisco"}), [
      {path: "location", reason: "required", params: [], message: "The location is required."},
    ])
    expectThrow(() => v.assert({name: "corgidisco", location: null}), [
      {path: "location", reason: "object", params: [], message: "The location must be an object."},
    ])
    expectThrow(() => v.assert({name: "corgidisco", location: true}), [
      {path: "location", reason: "object", params: [], message: "The location must be an object."},
    ])
    expectThrow(() => v.assert({name: "corgidisco", location: false}), [
      {path: "location", reason: "object", params: [], message: "The location must be an object."},
    ])
    expectThrow(() => v.assert({name: "corgidisco", location: "string"}), [
      {path: "location", reason: "object", params: [], message: "The location must be an object."},
    ])
    expectThrow(() => v.assert({name: "corgidisco", location: 3.141592}), [
      {path: "location", reason: "object", params: [], message: "The location must be an object."},
    ])

    expectThrow(() => v.assert({name: "corgidisco", location: {lat: "10", lng: 20}}), [
      {path: "location.lat", reason: "int", params: [], message: "The location.lat must be an integer."},
    ])
    expectThrow(() => v.assert({name: "corgidisco", location: {lat: 10, lng: "20"}}), [
      {path: "location.lng", reason: "int", params: [], message: "The location.lng must be an integer."},
    ])
    expectThrow(() => v.assert({name: "corgidisco", location: {lat: 10.3, lng: 20}}), [
      {path: "location.lat", reason: "int", params: [], message: "The location.lat must be an integer."},
    ])
    expectThrow(() => v.assert({name: "corgidisco", location: {lat: 10, lng: 20.5}}), [
      {path: "location.lng", reason: "int", params: [], message: "The location.lng must be an integer."},
    ])
    expectThrow(() => v.assert({name: "corgidisco", location: {}}), [
      {path: "location.lat", reason: "required", params: [], message: "The location.lat is required."},
      {path: "location.lng", reason: "required", params: [], message: "The location.lng is required."},
    ])
  })

  it(`test complex`, () => {
    const v = safen.create(`{
      name: string,
      locations: {
        lat: int,
        lng: int,
      }[],
    }[] | {
      username: string
    }`)

    expect(v.validate({username: "corgidisco"})).toBeTruthy()
    expect(v.validate([{name: "corgidisco", locations: []}])).toBeTruthy()

    expect(v.validate({name: "corgidisco", locations: []})).toBeFalsy()
    expect(v.validate([{username: "corgidisco"}])).toBeFalsy()

    expect(v.assert({username: "corgidisco"})).toEqual({username: "corgidisco"})
    expect(v.assert([{name: "corgidisco", locations: []}])).toEqual([{name: "corgidisco", locations: []}])

    expectThrow(() => v.assert({name: "corgidisco", locations: []}), [
      {path: "", reason: "array", params: [], message: "It must be an array."},
      {path: "username", reason: "required", params: [], message: "The username is required."},
    ])
    expectThrow(() => v.assert([{username: "corgidisco"}]), [
      {path: "[0].name", reason: "required", params: [], message: "The [0].name is required."},
      {path: "[0].locations", reason: "required", params: [], message: "The [0].locations is required."},
      {path: "username", reason: "required", params: [], message: "The username is required."},
    ])
  })

  it("test error params", () => {
    const v = safen.create(`{
      something: test(true, false, null, "string", 3.14, -500.5, /ab\\/c/igm)
    }`, {
      testers: {
        test: () => "false",
      },
      messages: {
        test: ["this is just test", "this is just test"],
      },
    })

    expectThrow(() => v.assert({something: "something"}), [
      {path: "something", reason: "test", params: [
        true,
        false,
        null,
        "string",
        3.14,
        -500.5,
        "/ab\\/c/gim", // regexp param must be string for JSON
      ], message: "this is just test"},
    ])
  })
})

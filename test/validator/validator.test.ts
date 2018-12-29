import "jest"
import { expectThrow } from "../utils"

import { messages } from "../../src/messages"
import { testers } from "../../src/testers"
import { Validator } from "../../src/validator/validator"

describe("validator", () => {
  it(`success, name: string`, () => {
    const v = new Validator({
      name: "string",
    }, testers, messages)

    expect(v.validate({name: "string"})).toBeTruthy()

    v.assert({name: "string"})

    expect(v.validate({})).toBeFalsy()
    expect(v.validate({name: null})).toBeFalsy()
    expect(v.validate({name: 10})).toBeFalsy()
    expect(v.validate({name: true})).toBeFalsy()
    expect(v.validate({name: false})).toBeFalsy()
  })

  it(`success, name?: string`, () => {
    const v = new Validator({
      "name?": "string",
    }, testers, messages)

    expect(v.validate({name: "string"})).toBeTruthy()
    expect(v.validate({})).toBeTruthy()

    expect(v.validate({name: null})).toBeFalsy()
    expect(v.validate({name: 10})).toBeFalsy()
    expect(v.validate({name: true})).toBeFalsy()
    expect(v.validate({name: false})).toBeFalsy()

    v.assert({name: "string"})
    v.assert({})

    expectThrow(() => v.assert({name: null}), [{path: "name", reason: "string", params: [], message: "The name must be a string."}])
    expectThrow(() => v.assert({name: 10}), [{path: "name", reason: "string", params: [], message: "The name must be a string."}])
    expectThrow(() => v.assert({name: true}), [{path: "name", reason: "string", params: [], message: "The name must be a string."}])
    expectThrow(() => v.assert({name: false}), [{path: "name", reason: "string", params: [], message: "The name must be a string."}])
  })

  it(`success, name[]: string`, () => {
    const v = new Validator({
      "name[]": "string",
    }, testers, messages)

    expect(v.validate({name: ["a1", "a2", "a3"]})).toBeTruthy()

    expect(v.validate({name: null})).toBeFalsy()
    expect(v.validate({name: 10})).toBeFalsy()
    expect(v.validate({name: true})).toBeFalsy()
    expect(v.validate({name: false})).toBeFalsy()
    expect(v.validate({name: "string"})).toBeFalsy()

    v.assert({name: ["a1", "a2", "a3"]})

    expectThrow(() => v.assert({name: null}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: 10}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: true}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: false}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: "string"}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
  })

  it(`success, name[3]: string`, () => {
    const v = new Validator({
      "name[3]": "string",
    }, testers, messages)

    expect(v.validate({name: ["a1", "a2", "a3"]})).toBeTruthy()

    expect(v.validate({name: null})).toBeFalsy()
    expect(v.validate({name: 10})).toBeFalsy()
    expect(v.validate({name: true})).toBeFalsy()
    expect(v.validate({name: false})).toBeFalsy()
    expect(v.validate({name: "string"})).toBeFalsy()
    expect(v.validate({name: ["a1", "a2"]})).toBeFalsy()
    expect(v.validate({name: ["a1", "a2", "a3", "a4"]})).toBeFalsy()

    v.assert({name: ["a1", "a2", "a3"]})

    expectThrow(() => v.assert({name: null}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: 10}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: true}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: false}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: "string"}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: ["a1", "a2"]}), [{path: "name", reason: "array_length", params: [3], message: "The name's length must be 3."}])
    expectThrow(() => v.assert({name: ["a1", "a2", "a3", "a4"]}), [{path: "name", reason: "array_length", params: [3], message: "The name's length must be 3."}])
  })

  it(`success, name[2:3]: string`, () => {
    const v = new Validator({
      "name[2:3]": "string",
    }, testers, messages)

    expect(v.validate({name: ["a1", "a2"]})).toBeTruthy()
    expect(v.validate({name: ["a1", "a2", "a3"]})).toBeTruthy()

    expect(v.validate({name: null})).toBeFalsy()
    expect(v.validate({name: 10})).toBeFalsy()
    expect(v.validate({name: true})).toBeFalsy()
    expect(v.validate({name: false})).toBeFalsy()
    expect(v.validate({name: "string"})).toBeFalsy()
    expect(v.validate({name: ["a1"]})).toBeFalsy()
    expect(v.validate({name: ["a1", "a2", "a3", "a4"]})).toBeFalsy()

    v.assert({name: ["a1", "a2"]})
    v.assert({name: ["a1", "a2", "a3"]})

    expectThrow(() => v.assert({name: null}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: 10}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: true}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: false}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: "string"}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: ["a1"]}), [{path: "name", reason: "array_length_between", params: [2, 3], message: "The name's length must be between 2 and 3."}])
    expectThrow(() => v.assert({name: ["a1", "a2", "a3", "a4"]}), [{path: "name", reason: "array_length_between", params: [2, 3], message: "The name's length must be between 2 and 3."}])
  })

  it(`success, name[2:]: string`, () => {
    const v = new Validator({
      "name[2:]": "string",
    }, testers, messages)

    expect(v.validate({name: ["a1", "a2"]})).toBeTruthy()
    expect(v.validate({name: ["a1", "a2", "a3"]})).toBeTruthy()
    expect(v.validate({name: ["a1", "a2", "a3", "a4"]})).toBeTruthy()

    expect(v.validate({name: null})).toBeFalsy()
    expect(v.validate({name: 10})).toBeFalsy()
    expect(v.validate({name: true})).toBeFalsy()
    expect(v.validate({name: false})).toBeFalsy()
    expect(v.validate({name: "string"})).toBeFalsy()
    expect(v.validate({name: ["a1"]})).toBeFalsy()

    v.assert({name: ["a1", "a2"]})
    v.assert({name: ["a1", "a2", "a3"]})
    v.assert({name: ["a1", "a2", "a3", "a4"]})

    expectThrow(() => v.assert({name: null}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: 10}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: true}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: false}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: "string"}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: ["a1"]}), [{path: "name", reason: "array_length_min", params: [2], message: "The name's length must be at least 2."}])
  })

  it(`success, name[:3]: string`, () => {
    const v = new Validator({
      "name[:3]": "string",
    }, testers, messages)

    expect(v.validate({name: []})).toBeTruthy()
    expect(v.validate({name: ["a1"]})).toBeTruthy()
    expect(v.validate({name: ["a1", "a2"]})).toBeTruthy()
    expect(v.validate({name: ["a1", "a2", "a3"]})).toBeTruthy()

    expect(v.validate({name: null})).toBeFalsy()
    expect(v.validate({name: 10})).toBeFalsy()
    expect(v.validate({name: true})).toBeFalsy()
    expect(v.validate({name: false})).toBeFalsy()
    expect(v.validate({name: "string"})).toBeFalsy()
    expect(v.validate({name: ["a1", "a2", "a3", "a4"]})).toBeFalsy()

    v.assert({name: []})
    v.assert({name: ["a1"]})
    v.assert({name: ["a1", "a2"]})
    v.assert({name: ["a1", "a2", "a3"]})

    expectThrow(() => v.assert({name: null}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: 10}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: true}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: false}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: "string"}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: ["a1", "a2", "a3", "a4"]}), [{path: "name", reason: "array_length_max", params: [3], message: "The name's length may not be greater than 3."}])
  })

  it(`success, name[2][3]: string`, () => {
    const v = new Validator({
      "name[2][3]": "string",
    }, testers, messages)

    expect(v.validate({name: [["a1", "a2"], ["a1", "a2"], ["a1", "a2"]]})).toBeTruthy()

    expect(v.validate({name: null})).toBeFalsy()
    expect(v.validate({name: 10})).toBeFalsy()
    expect(v.validate({name: true})).toBeFalsy()
    expect(v.validate({name: false})).toBeFalsy()
    expect(v.validate({name: "string"})).toBeFalsy()
    expect(v.validate({name: [["a1", "a2", "a3"], ["a1", "a2", "a3"]]})).toBeFalsy()

    v.assert({name: [["a1", "a2"], ["a1", "a2"], ["a1", "a2"]]})

    expectThrow(() => v.assert({name: null}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: 10}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: true}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: false}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: "string"}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: [["a1", "a2", "a3"], ["a1", "a2", "a3"]]}), [{path: "name", reason: "array_length", params: [3], message: "The name's length must be 3."}])
  })

  it(`success, name: string & email`, () => {
    const v = new Validator({
      name: "string & email",
    }, testers, messages)

    expect(v.validate({name: "corgidisco@gmail.com"})).toBeTruthy()

    expect(v.validate({name: null})).toBeFalsy()
    expect(v.validate({name: 10})).toBeFalsy()
    expect(v.validate({name: true})).toBeFalsy()
    expect(v.validate({name: false})).toBeFalsy()
    expect(v.validate({name: "string"})).toBeFalsy()

    v.assert({name: "corgidisco@gmail.com"})

    expectThrow(() => v.assert({name: null}), [{path: "name", reason: "string", params: [], message: "The name must be a string."}])
    expectThrow(() => v.assert({name: 10}), [{path: "name", reason: "string", params: [], message: "The name must be a string."}])
    expectThrow(() => v.assert({name: true}), [{path: "name", reason: "string", params: [], message: "The name must be a string."}])
    expectThrow(() => v.assert({name: false}), [{path: "name", reason: "string", params: [], message: "The name must be a string."}])
    expectThrow(() => v.assert({name: "string"}), [{path: "name", reason: "email", params: [], message: "The name must be a valid email address."}])
  })

  it(`success, name: (string & email) | null`, () => {
    const v = new Validator({
      name: "(string & email) | null",
    }, testers, messages)

    expect(v.validate({name: "corgidisco@gmail.com"})).toBeTruthy()
    expect(v.validate({name: null})).toBeTruthy()

    expect(v.validate({name: 10})).toBeFalsy()
    expect(v.validate({name: true})).toBeFalsy()
    expect(v.validate({name: false})).toBeFalsy()
    expect(v.validate({name: "string"})).toBeFalsy()

    v.assert({name: "corgidisco@gmail.com"})
    v.assert({name: null})

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

  it(`success, name[]: (string & email) | null`, () => {
    const v = new Validator({
      "name[]": "(string & email) | null",
    }, testers, messages)

    expect(v.validate({name: ["corgidisco@gmail.com", "corgidisco2@gmail.com"]})).toBeTruthy()
    expect(v.validate({name: []})).toBeTruthy()

    expect(v.validate({name: 10})).toBeFalsy()
    expect(v.validate({name: true})).toBeFalsy()
    expect(v.validate({name: false})).toBeFalsy()
    expect(v.validate({name: "string"})).toBeFalsy()

    v.assert({name: ["corgidisco@gmail.com", "corgidisco2@gmail.com"]})
    v.assert({name: []})

    expectThrow(() => v.assert({name: 10}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: true}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: false}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
    expectThrow(() => v.assert({name: "string"}), [{path: "name", reason: "array", params: [], message: "The name must be an array."}])
  })

  it(`success, name: string, location: {lat: int, lng: int}`, () => {
    const v = new Validator({
      name: "string",
      location: {
        lat: "int",
        lng: "int",
      },
    }, testers, messages)

    expect(v.validate({name: "corgidisco", location: {lat: 10, lng: 20}})).toBeTruthy()

    expect(v.validate({name: "corgidisco", location: {lat: "10", lng: 20}})).toBeFalsy()
    expect(v.validate({name: "corgidisco", location: {lat: 10, lng: "20"}})).toBeFalsy()
    expect(v.validate({name: "corgidisco", location: {lat: 10.3, lng: 20}})).toBeFalsy()
    expect(v.validate({name: "corgidisco", location: {lat: 10, lng: 20.5}})).toBeFalsy()
    expect(v.validate({name: "corgidisco", location: {}})).toBeFalsy()

    v.assert({name: "corgidisco", location: {lat: 10, lng: 20}})

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
})

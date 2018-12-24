import "jest"

import { emailTester } from "../../src/testers/email"
import { intTester } from "../../src/testers/int"
import { nullTester } from "../../src/testers/null"
import { stringTester } from "../../src/testers/string"
import { Validator } from "../../src/validator/validator"


const testers = {
  string: stringTester,
  email: emailTester,
  int: intTester,
  null: nullTester,
}

describe("validator", () => {
  it(`success, name: string`, () => {
    const validator = new Validator({
      name: "string",
    }, testers)

    expect(validator.validate({name: "string"})).toBeTruthy()

    validator.assert({name: "string"})

    expect(validator.validate({})).toBeFalsy()
    expect(validator.validate({name: null})).toBeFalsy()
    expect(validator.validate({name: 10})).toBeFalsy()
    expect(validator.validate({name: true})).toBeFalsy()
    expect(validator.validate({name: false})).toBeFalsy()
  })

  it(`success, name?: string`, () => {
    const validator = new Validator({
      "name?": "string",
    }, testers)

    expect(validator.validate({name: "string"})).toBeTruthy()
    expect(validator.validate({})).toBeTruthy()

    validator.assert({name: "string"})
    validator.assert({})

    expect(validator.validate({name: null})).toBeFalsy()
    expect(validator.validate({name: 10})).toBeFalsy()
    expect(validator.validate({name: true})).toBeFalsy()
    expect(validator.validate({name: false})).toBeFalsy()
  })

  it(`success, name[]: string`, () => {
    const validator = new Validator({
      "name[]": "string",
    }, testers)

    expect(validator.validate({name: ["a1", "a2", "a3"]})).toBeTruthy()

    validator.assert({name: ["a1", "a2", "a3"]})

    expect(validator.validate({name: null})).toBeFalsy()
    expect(validator.validate({name: 10})).toBeFalsy()
    expect(validator.validate({name: true})).toBeFalsy()
    expect(validator.validate({name: false})).toBeFalsy()
    expect(validator.validate({name: "string"})).toBeFalsy()
  })

  it(`success, name[3]: string`, () => {
    const validator = new Validator({
      "name[3]": "string",
    }, testers)

    expect(validator.validate({name: ["a1", "a2", "a3"]})).toBeTruthy()

    validator.assert({name: ["a1", "a2", "a3"]})

    expect(validator.validate({name: null})).toBeFalsy()
    expect(validator.validate({name: 10})).toBeFalsy()
    expect(validator.validate({name: true})).toBeFalsy()
    expect(validator.validate({name: false})).toBeFalsy()
    expect(validator.validate({name: "string"})).toBeFalsy()
    expect(validator.validate({name: ["a1", "a2"]})).toBeFalsy()
    expect(validator.validate({name: ["a1", "a2", "a3", "a4"]})).toBeFalsy()
  })

  it(`success, name[2:3]: string`, () => {
    const validator = new Validator({
      "name[2:3]": "string",
    }, testers)

    expect(validator.validate({name: ["a1", "a2"]})).toBeTruthy()
    expect(validator.validate({name: ["a1", "a2", "a3"]})).toBeTruthy()

    validator.assert({name: ["a1", "a2"]})
    validator.assert({name: ["a1", "a2", "a3"]})

    expect(validator.validate({name: null})).toBeFalsy()
    expect(validator.validate({name: 10})).toBeFalsy()
    expect(validator.validate({name: true})).toBeFalsy()
    expect(validator.validate({name: false})).toBeFalsy()
    expect(validator.validate({name: "string"})).toBeFalsy()
    expect(validator.validate({name: ["a1"]})).toBeFalsy()
    expect(validator.validate({name: ["a1", "a2", "a3", "a4"]})).toBeFalsy()
  })

  it(`success, name[2:]: string`, () => {
    const validator = new Validator({
      "name[2:]": "string",
    }, testers)

    expect(validator.validate({name: ["a1", "a2"]})).toBeTruthy()
    expect(validator.validate({name: ["a1", "a2", "a3"]})).toBeTruthy()
    expect(validator.validate({name: ["a1", "a2", "a3", "a4"]})).toBeTruthy()

    validator.assert({name: ["a1", "a2"]})
    validator.assert({name: ["a1", "a2", "a3"]})
    validator.assert({name: ["a1", "a2", "a3", "a4"]})

    expect(validator.validate({name: null})).toBeFalsy()
    expect(validator.validate({name: 10})).toBeFalsy()
    expect(validator.validate({name: true})).toBeFalsy()
    expect(validator.validate({name: false})).toBeFalsy()
    expect(validator.validate({name: "string"})).toBeFalsy()
    expect(validator.validate({name: ["a1"]})).toBeFalsy()
  })

  it(`success, name[:3]: string`, () => {
    const validator = new Validator({
      "name[:3]": "string",
    }, testers)

    expect(validator.validate({name: []})).toBeTruthy()
    expect(validator.validate({name: ["a1"]})).toBeTruthy()
    expect(validator.validate({name: ["a1", "a2"]})).toBeTruthy()
    expect(validator.validate({name: ["a1", "a2", "a3"]})).toBeTruthy()

    validator.assert({name: []})
    validator.assert({name: ["a1"]})
    validator.assert({name: ["a1", "a2"]})
    validator.assert({name: ["a1", "a2", "a3"]})

    expect(validator.validate({name: null})).toBeFalsy()
    expect(validator.validate({name: 10})).toBeFalsy()
    expect(validator.validate({name: true})).toBeFalsy()
    expect(validator.validate({name: false})).toBeFalsy()
    expect(validator.validate({name: "string"})).toBeFalsy()
    expect(validator.validate({name: ["a1", "a2", "a3", "a4"]})).toBeFalsy()
  })

  it(`success, name[2][3]: string`, () => {
    const validator = new Validator({
      "name[2][3]": "string",
    }, testers)

    expect(validator.validate({name: [["a1", "a2"], ["a1", "a2"], ["a1", "a2"]]})).toBeTruthy()

    validator.assert({name: [["a1", "a2"], ["a1", "a2"], ["a1", "a2"]]})

    expect(validator.validate({name: null})).toBeFalsy()
    expect(validator.validate({name: 10})).toBeFalsy()
    expect(validator.validate({name: true})).toBeFalsy()
    expect(validator.validate({name: false})).toBeFalsy()
    expect(validator.validate({name: "string"})).toBeFalsy()
    expect(validator.validate({name: [["a1", "a2", "a3"], ["a1", "a2", "a3"]]})).toBeFalsy()
  })

  it(`success, name: string & email`, () => {
    const validator = new Validator({
      name: "string & email",
    }, testers)

    expect(validator.validate({name: "corgidisco@gmail.com"})).toBeTruthy()

    validator.assert({name: "corgidisco@gmail.com"})

    expect(validator.validate({name: null})).toBeFalsy()
    expect(validator.validate({name: 10})).toBeFalsy()
    expect(validator.validate({name: true})).toBeFalsy()
    expect(validator.validate({name: false})).toBeFalsy()
    expect(validator.validate({name: "string"})).toBeFalsy()
  })

  it(`success, name: (string & email) | null`, () => {
    const validator = new Validator({
      name: "(string & email) | null",
    }, testers)

    expect(validator.validate({name: "corgidisco@gmail.com"})).toBeTruthy()
    expect(validator.validate({name: null})).toBeTruthy()

    validator.assert({name: "corgidisco@gmail.com"})
    validator.assert({name: null})

    expect(validator.validate({name: 10})).toBeFalsy()
    expect(validator.validate({name: true})).toBeFalsy()
    expect(validator.validate({name: false})).toBeFalsy()
    expect(validator.validate({name: "string"})).toBeFalsy()
  })

  it(`success, name[]: (string & email) | null`, () => {
    const validator = new Validator({
      "name[]": "(string & email) | null",
    }, testers)

    expect(validator.validate({name: ["corgidisco@gmail.com", "corgidisco2@gmail.com"]})).toBeTruthy()
    expect(validator.validate({name: []})).toBeTruthy()

    validator.assert({name: ["corgidisco@gmail.com", "corgidisco2@gmail.com"]})
    validator.assert({name: []})

    expect(validator.validate({name: 10})).toBeFalsy()
    expect(validator.validate({name: true})).toBeFalsy()
    expect(validator.validate({name: false})).toBeFalsy()
    expect(validator.validate({name: "string"})).toBeFalsy()
  })

  it(`success, name: string, location: {lat: int, lng: int}`, () => {
    const validator = new Validator({
      name: "string",
      location: {
        lat: "int",
        lng: "int",
      },
    }, testers)

    expect(validator.validate({name: "corgidisco", location: {lat: 10, lng: 20}})).toBeTruthy()
    validator.assert({name: "corgidisco", location: {lat: 10, lng: 20}})

    expect(validator.validate({name: "corgidisco", location: {lat: "10", lng: 20}})).toBeFalsy()
    expect(validator.validate({name: "corgidisco", location: {lat: 10, lng: "20"}})).toBeFalsy()
    expect(validator.validate({name: "corgidisco", location: {lat: 10.3, lng: 20}})).toBeFalsy()
    expect(validator.validate({name: "corgidisco", location: {lat: 10, lng: 20.5}})).toBeFalsy()
    expect(validator.validate({name: "corgidisco", location: {}})).toBeFalsy()
  })
})

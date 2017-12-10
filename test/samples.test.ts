
import "jest"

import safen from "../dist"
import {InvalidValueError} from "../dist"

describe("samples", () => {
  it("sample usage", () => {
    expect.assertions(1)

    const nativeConsoleLog = console.log
    console.log = (error: any): void => {
      expect(error).toEqual(["array_length_min:1@areas"])
    }

    // section:optional
    const validator = safen.create({
      "username": "string|length_between:4,20",
      "password?": "length_between:8,20", // optional
      "areas[1:]": {
        lat: "float | between:-90,90",
        lng: "float | between:-180,180",
      },
    })

    validator.assert({
      username: "username",
      areas: [{
        lat: 0,
        lng: 0,
      }],
    }) // ok

    try {
      validator.assert({
        username: "corgidisco",
        password: "password!@#",
        areas: [],
      }) // fail
    } catch (e) {
      if (e instanceof InvalidValueError) {
        console.log(e.getErrors()) // output is [ 'array_length_min:1@areas' ]
      }
    }
    // endsection

    console.log = nativeConsoleLog
  })

  it("sample optional", () => {
    expect.assertions(0)

    // section:optional
    const validator = safen.create({
      "username": "string|length_between:4,20",
      "password?": "length_between:8,20", // optional
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

  it("sample object-in-object", () => {
    expect.assertions(0)

    // section:object-in-object
    const validator = safen.create({
      username: "string|length_between:4,20",
      areas: {
        lat: "number",
        lng: "number",
      },
    })

    validator.assert({
      username: "corgidisco",
      areas: {
        lat: 37,
        lng: 126,
      },
    }) // ok
    // endsection
  })

  it("sample array", () => {
    expect.assertions(0)

    // section:array
    const validator = safen.create({
      "areas[]": { // array
        lat: "number",
        lng: "number",
      },
    })

    validator.assert({
      areas: [
        {lat: 37, lng: 126},
        {lat: 31, lng: 125},
      ],
    }) // ok
    // endsection
  })

  it("sample array fixed", () => {
    expect.assertions(1)

    const nativeConsoleLog = console.log
    console.log = (error: any): void => {
      expect(error).toEqual(["array_length_max:2@areas"])
    }

    // section:array-fixed
    const validator = safen.create({
      "areas[:2]": { // array
        lat: "number",
        lng: "number",
      },
    })

    validator.assert({
      areas: [
        {lat: 37, lng: 126},
        {lat: 31, lng: 125},
      ],
    }) // ok

    try {
      validator.assert({
        areas: [
          {lat: 37, lng: 126},
          {lat: 31, lng: 125},
          {lat: 31, lng: 125},
        ],
      }) // fail
    } catch (e) {
      if (e instanceof InvalidValueError) {
        console.log(e.getErrors()) // output is [ 'array_length_max:2@areas' ]
      }
    }
    // endsection

    console.log = nativeConsoleLog
  })

  it("sample array multi dim", () => {
    expect.assertions(1)

    const nativeConsoleLog = console.log
    console.log = (error: any): void => {
      expect(error).toEqual(["array@areas[0]", "array@areas[1]"])
    }

    // section:array-multi-dim
    const validator = safen.create({
      "areas[][]": { // array
        lat: "number",
        lng: "number",
      },
    })

    validator.assert({
      areas: [
        [
          {lat: 37, lng: 126},
          {lat: 31, lng: 125},
        ],
        [
          {lat: 37, lng: 126},
          {lat: 31, lng: 125},
        ],
      ],
    }) // ok

    try {
      validator.assert({
        areas: [
          {lat: 37, lng: 126},
          {lat: 31, lng: 125},
        ],
      }) // fail
    } catch (e) {
      if (e instanceof InvalidValueError) {
        console.log(e.getErrors()) // output is [ 'array@areas[0]', 'array@areas[1]' ]
      }
    }
    // endsection

    console.log = nativeConsoleLog
  })

  it("sample lodash validator", () => {
    expect.assertions(0)

    // section:lodash-validator
    const validator = safen.create({
      "areas[]": {
        lat: "lodash.isNumber",
        lng: "lodash.isNumber",
      },
    })

    validator.assert({
      areas: [
        {lat: 37, lng: 126},
        {lat: 31, lng: 125},
      ],
    }) // ok
    // endsection
  })

  it("sample validator validator", () => {
    expect.assertions(1)

    const nativeConsoleLog = console.log
    console.log = (error: any): void => {
      expect(error).toEqual(["validator.isEmail@username"])
    }

    // section:validator-validator
    const validator = safen.create({
      username: "validator.isEmail",
    })

    validator.assert({
      username: "corgidisco@gmail.com",
    }) // ok

    try {
      validator.assert({
        username: "corgidisco",
      }) // fail
    } catch (e) {
      if (e instanceof InvalidValueError) {
        console.log(e.getErrors()) // output is [ 'validator.isEmail@username' ]
      }
    }
    // endsection

    console.log = nativeConsoleLog
  })
})

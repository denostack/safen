
import "jest"

import * as safen from "../dist"

describe("usage", () => {
  it("usage", () => {
    expect.assertions(0)

    // section:usage-default
    const validator = safen.create({
      "username": "string|email|length_between:12,100",
      "password?": "string|length_between:8,20",
      "areas[1:]": {
        lat: "number|between:-90,90",
        lng: "number|between:-180,180",
      },
      "env": {
        referer: "url",
        ip: "ip:v4",
        os: {
          name: "in:window,osx,android,iphone",
          version: "string",
        },
        browser: {
          name: "in:chrome,firefox,edge,ie",
          version: "string",
        },
      },
    })

    validator.assert({
      username: "corgidisco@gmail.com",
      areas: [
        {lat: 0, lng: 0},
      ],
      env: {
        referer: "http://corgidisco.github.io",
        ip: "127.0.0.1",
        os: {
          name: "osx",
          version: "10.13.1",
        },
        browser: {
          name: "chrome",
          version: "62.0.3202.94",
        },
      },
    }) // ok
    // endsection
  })
})


describe("sample pipe", () => {
  it("sample pipe", () => {
    expect.assertions(1)

    const nativeConsoleLog = console.log
    console.log = (error: any): void => {
      expect(error).toEqual([
        {reason: "email@username", message: "The username must be a valid email address."},
        {reason: "length_between:12,100@username", message: "The username's length must be between 12 and 100."},
      ])
    }

    // section:sample-pipe
    const validator = safen.create({
      username: "string|email|length_between:12,100",
    })

    validator.assert({
      username: "corgidisco@gmail.com",
    }) // ok

    try {
      validator.assert({
        username: "corgidisco",
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        // output is :
        // [ { reason: 'email@username', message: 'The username must be a valid email address.' },
        //   { reason: 'length_between:12,100@username', message: 'The username\'s length must be between 12 and 100.' } ]
        console.log(e.errors())
      }
    }
    // endsection

    console.log = nativeConsoleLog
  })
})

describe("sample optional", () => {
  it("sample optional", () => {
    expect.assertions(1)

    const nativeConsoleLog = console.log
    console.log = (error: any): void => {
      expect(error).toEqual([
        {reason: "required@username", message: "The username is required."},
      ])
    }

    // section:sample-optional
    const validator = safen.create({
      "username": "string|length_between:4,20",
      "password?": "length_between:8,20", // optional
    })

    validator.assert({
      username: "corgidisco",
      password: "password!@#",
    }) // ok

    validator.assert({
      username: "username",
      // undefined password is OK.
    }) // ok

    validator.assert({
      username: "username",
      password: null, // null password is also OK.
    }) // ok

    try {
      validator.assert({
        // undefined username is not ok.
        password: "password!@#",
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        // output is :
        // [ { reason: 'required@username', message: 'The username is required.' } ]
        console.log(e.errors())
      }
    }
    // endsection

    console.log = nativeConsoleLog
  })
})

describe("sample object in object", () => {
  it("sample object in object", () => {
    expect.assertions(0)

    // section:sample-object-in-object
    const validator = safen.create({
      username: "string|length_between:4,20",
      areas: {
        lat: "number|between:-90,90",
        lng: "number|between:-180,180",
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
})

describe("sample array", () => {
  it("sample simple array", () => {
    expect.assertions(1)

    const nativeConsoleLog = console.log
    console.log = (error: any): void => {
      expect(error).toEqual([
        {reason: "array@areas", message: "The areas must be an array."},
      ])
    }

    // section:sample-simple-array
    const validator = safen.create({
      "areas[]": { // array
        lat: "number",
        lng: "number",
      },
    })

    validator.assert({
      areas: [], // empty is OK
    }) // ok

    validator.assert({
      areas: [
        {lat: 37, lng: 126},
        {lat: 31, lng: 125},
      ],
    }) // ok

    try {
      validator.assert({
        areas: "",
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        // output is :
        // [ { reason: 'array@areas', message: 'The areas must be an array.' } ]
        console.log(e.errors())
      }
    }
    // endsection

    console.log = nativeConsoleLog
  })

  it("sample array with range, fixed", () => {
    expect.assertions(2)

    const nativeConsoleLog = console.log
    console.log = (error: any): void => {
      expect(error).toEqual([
        {reason: "array_length:2@areas", message: "The areas's length must be 2."},
      ])
    }

    // section:sample-array-with-range-fixed
    const validator = safen.create({
      "areas[2]": { // array
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
      if (e instanceof safen.InvalidValueError) {
        // output is :
        // [ { reason: 'array_length:2@areas', message: 'The areas's length must be 2.' } ]
        console.log(e.errors())
      }
    }

    try {
      validator.assert({
        areas: [
          {lat: 37, lng: 126},
        ],
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        // output is :
        // [ { reason: 'array_length:2@areas', message: 'The areas's length must be 2.' } ]
        console.log(e.errors())
      }
    }
    // endsection

    console.log = nativeConsoleLog
  })

  it("sample array with range, min", () => {
    expect.assertions(1)

    const nativeConsoleLog = console.log
    console.log = (error: any): void => {
      expect(error).toEqual([
        {reason: "array_length_min:1@areas", message: "The areas's length must be at least 1."},
      ])
    }

    // section:sample-array-with-range-min
    const validator = safen.create({
      "areas[1:]": { // array
        lat: "number",
        lng: "number",
      },
    })

    validator.assert({
      areas: [
        {lat: 31, lng: 125},
      ],
    }) // ok

    validator.assert({
      areas: [
        {lat: 37, lng: 126},
        {lat: 31, lng: 125},
      ],
    }) // ok

    try {
      validator.assert({
        areas: [],
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        // output is :
        // [ { reason: 'array_length_min:1@areas', message: 'The areas's length must be at least 1.' } ]
        console.log(e.errors())
      }
    }
    // endsection

    console.log = nativeConsoleLog
  })

  it("sample array with range, max", () => {
    expect.assertions(1)

    const nativeConsoleLog = console.log
    console.log = (error: any): void => {
      expect(error).toEqual([
        {reason: "array_length_max:2@areas", message: "The areas's length may not be greater than 2."},
      ])
    }

    // section:sample-array-with-range-max
    const validator = safen.create({
      "areas[:2]": { // array
        lat: "number",
        lng: "number",
      },
    })

    validator.assert({
      areas: [
        {lat: 31, lng: 125},
      ],
    }) // ok

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
          {lat: 32, lng: 121},
        ],
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        // output is :
        // [ { reason: 'array_length_max:2@areas', message: 'The areas's length may not be greater than 2.' } ]
        console.log(e.errors())
      }
    }
    // endsection

    console.log = nativeConsoleLog
  })

  it("sample array with range, between", () => {
    expect.assertions(2)

    const nativeConsoleLog = console.log
    console.log = (error: any): void => {
      expect(error).toEqual([
        {reason: "array_length_between:1,2@areas", message: "The areas's length must be between 1 and 2."},
      ])
    }

    // section:sample-array-with-range-between
    const validator = safen.create({
      "areas[1:2]": { // array
        lat: "number",
        lng: "number",
      },
    })

    validator.assert({
      areas: [
        {lat: 31, lng: 125},
      ],
    }) // ok

    validator.assert({
      areas: [
        {lat: 37, lng: 126},
        {lat: 31, lng: 125},
      ],
    }) // ok

    try {
      validator.assert({
        areas: [],
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        // output is :
        // [ { reason: 'array_length_between:1,2@areas', message: 'The areas's length must be between 1 and 2.' } ]
        console.log(e.errors())
      }
    }

    try {
      validator.assert({
        areas: [
          {lat: 37, lng: 126},
          {lat: 31, lng: 125},
          {lat: 32, lng: 121},
        ],
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        // output is :
        // [ { reason: 'array_length_between:1,2@areas', message: 'The areas's length must be between 1 and 2.' } ]
        console.log(e.errors())
      }
    }
    // endsection

    console.log = nativeConsoleLog
  })

  it("sample array with multi dims", () => {
    expect.assertions(1)

    const nativeConsoleLog = console.log
    console.log = (error: any): void => {
      expect(error).toEqual([
        {reason: "array@areas[0]", message: "The areas[0] must be an array."},
        {reason: "array@areas[1]", message: "The areas[1] must be an array."},
      ])
    }

    // section:sample-array-with-multi-dims
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
      if (e instanceof safen.InvalidValueError) {
        // output is :
        // [ { reason: 'array@areas[0]', message: 'The areas[0] must be an array.' },
        //   { reason: 'array@areas[1]', message: 'The areas[1] must be an array.' } ]
        console.log(e.errors())
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
      expect(error).toEqual([
        {reason: "validator.isEmail@username", message: "An validator.isEmail error occured in username."},
      ])
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
      if (e instanceof safen.InvalidValueError) {
        // output is :
        // [ { reason: 'validator.isEmail@username', message: 'An validator.isEmail error occured in username.' } ]
        console.log(e.errors())
      }
    }
    // endsection

    console.log = nativeConsoleLog
  })
})

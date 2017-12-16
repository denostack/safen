
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
      expect(error).toEqual(["email@username", "length_between:12,100@username"])
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
        console.log(e.reasons()) // output is [ 'email@username', 'length_between:12,100@username' ]
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
      expect(error).toEqual(["required@username"])
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
        console.log(e.reasons()) // output is [ 'required@username' ]
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
      expect(error).toEqual(["array@areas"])
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
        console.log(e.reasons()) // output is [ 'array@areas' ]
      }
    }
    // endsection

    console.log = nativeConsoleLog
  })

  it("sample array with range, fixed", () => {
    expect.assertions(2)

    const nativeConsoleLog = console.log
    console.log = (error: any): void => {
      expect(error).toEqual(["array_length:2@areas"])
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
        console.log(e.reasons()) // output is [ 'array_length:2@areas' ]
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
        console.log(e.reasons()) // output is [ 'array_length:2@areas' ]
      }
    }
    // endsection

    console.log = nativeConsoleLog
  })

  it("sample array with range, min", () => {
    expect.assertions(1)

    const nativeConsoleLog = console.log
    console.log = (error: any): void => {
      expect(error).toEqual(["array_length_min:1@areas"])
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
        console.log(e.reasons()) // output is [ 'array_length_min:1@areas' ]
      }
    }
    // endsection

    console.log = nativeConsoleLog
  })

  it("sample array with range, max", () => {
    expect.assertions(1)

    const nativeConsoleLog = console.log
    console.log = (error: any): void => {
      expect(error).toEqual(["array_length_max:2@areas"])
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
        console.log(e.reasons()) // output is [ 'array_length_max:2@areas' ]
      }
    }
    // endsection

    console.log = nativeConsoleLog
  })

  it("sample array with range, between", () => {
    expect.assertions(2)

    const nativeConsoleLog = console.log
    console.log = (error: any): void => {
      expect(error).toEqual(["array_length_between:1,2@areas"])
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
        areas: [
        ],
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        console.log(e.reasons()) // output is [ 'array_length_between:1,2@areas' ]
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
        console.log(e.reasons()) // output is [ 'array_length_between:1,2@areas' ]
      }
    }
    // endsection

    console.log = nativeConsoleLog
  })

  it("sample array with multi dims", () => {
    expect.assertions(1)

    const nativeConsoleLog = console.log
    console.log = (error: any): void => {
      expect(error).toEqual(["array@areas[0]", "array@areas[1]"])
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
        console.log(e.reasons()) // output is [ 'array@areas[0]', 'array@areas[1]' ]
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
      if (e instanceof safen.InvalidValueError) {
        console.log(e.reasons()) // output is [ 'validator.isEmail@username' ]
      }
    }
    // endsection

    console.log = nativeConsoleLog
  })
})

import * as safen from '../lib' // eslint-disable-line import/no-namespace

describe('usage', () => {
  it('usage default', () => {
    expect.assertions(0)

    // section:usage-default
    const validator = safen.sfl`{
      username: (string & email & length_between(12, 100)) | null,
      password?: string & length_between(8, 20),
      areas: {
        lat: number & between(-90, 90),
        lng: number & between(-180, 180),
      }[1:] | null,
      env: {
        referer: url,
        ip: ip("v4"),
        os: {
          name: in("window", "osx", "android", "iphone"),
          version: string,
        },
        browser: {
          name: in("chrome", "firefox", "edge", "ie"),
          version: string,
        },
      },
    }`

    validator.assert({
      username: 'corgidisco@gmail.com',
      areas: [
        { lat: 0, lng: 0 },
      ],
      env: {
        referer: 'http://corgidisco.github.io',
        ip: '127.0.0.1',
        os: {
          name: 'osx',
          version: '10.13.1',
        },
        browser: {
          name: 'chrome',
          version: '62.0.3202.94',
        },
      },
    }) // ok
    // endsection
  })

  it('usage validate', () => {
    expect.assertions(3)

    const data = 'something' as any

    // section:usage-validate
    const validator = safen.sfl<string | null>`(string & email & length_between(12, 100)) | null`

    // in javascript,
    // const validator = safen.sfl`(string & email & length_between(12, 100)) | null`
    // const validator = safen.create(`(string & email & length_between(12, 100)) | null`)

    // typescript with Generic
    if (validator.validate(data)) {
      // now data is string!
    }

    validator.validate('corgidisco@gmail.com') // return true
    validator.validate(null) // return true

    validator.validate('corgidisco') // return false, it is not email!
    // endsection

    expect(validator.validate('corgidisco@gmail.com')).toBeTruthy()
    expect(validator.validate(null)).toBeTruthy()

    expect(validator.validate('corgidisco')).toBeFalsy() // return false!!!
  })

  it('usage assert', () => {
    expect.assertions(1)

    try {
      // section:usage-assert
      const validator = safen.sfl<string | null>`(string & email & length_between(12, 100)) | null`

      // in javascript,
      // const validator = safen.sfl`(string & email & length_between(12, 100)) | null`
      // const validator = safen.create(`(string & email & length_between(12, 100)) | null`)

      validator.assert('corgidisco@gmail.com') // nothing happens
      validator.assert(null) // nothing happens

      validator.assert('corgidisco') // safen.InvalidValudError occured!
      // endsection
    } catch (e) {
      expect(e).toBeInstanceOf(safen.InvalidValueError)
    }
  })
})


describe('sample pipe', () => {
  it('sample pipe', () => {
    expect.assertions(1)
    // section:sample-pipe
    const validator = safen.sfl`{
      username: (string & email & length_between(12, 100)) | null,
    }`

    validator.assert({
      username: 'corgidisco@gmail.com',
    }) // ok
    validator.assert({
      username: null,
    }) // ok

    try {
      validator.assert({
        username: 'corgidisco',
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        expect(e.errors).toEqual([
          {
            path: 'username',
            reason: 'email',
            params: [],
            message: 'The username must be a valid email address.',
          },
          {
            path: 'username',
            reason: 'null',
            params: [],
            message: 'The username must be a null.',
          },
        ])
      }
    }
    // endsection
  })
})

describe('sample optional', () => {
  it('sample optional', () => {
    expect.assertions(1)
    // section:sample-optional
    const validator = safen.sfl`{
      username: string & length_between(4, 20),
      password?: length_between(8, 20),
    }`

    validator.assert({
      username: 'corgidisco',
      password: 'password!@#',
    }) // ok

    validator.assert({
      username: 'corgidisco',
      // undefined password is OK.
    }) // ok

    validator.assert({
      username: 'corgidisco',
      password: undefined, // undefined password is also OK.
    }) // ok

    try {
      validator.assert({
        // undefined username is not ok.
        password: 'password!@#',
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        expect(e.errors).toEqual([
          {
            path: 'username',
            reason: 'required',
            params: [],
            message: 'The username is required.',
          },
        ])
      }
    }

    try {
      validator.assert({
        username: 'corgidisco',
        password: null, // null is not allowed
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        expect(e.errors).toEqual([
          {
            path: 'password',
            reason: 'length',
            params: [],
            message: 'The username is required.',
          },
        ])
      }
    }
    // endsection
  })
})

describe('sample object in object', () => {
  it('sample object in object', () => {
    expect.assertions(1)

    // section:sample-object-in-object
    const validator = safen.sfl`{
      username: string & length_between(4, 20),
      areas: {
        lat: number & between(-90, 90),
        lng: number & between(-180, 180),
      },
    }`

    validator.assert({
      username: 'corgidisco',
      areas: {
        lat: 37,
        lng: 126,
      },
    }) // ok

    try {
      validator.assert({
        username: 'corgidisco',
        areas: {
          lat: '37',
          lng: 126,
        },
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        expect(e.errors).toEqual([
          {
            path: 'areas.lat',
            reason: 'number',
            params: [],
            message: 'The areas.lat must be a number.',
          },
        ])
      }
    }

    validator.assert({
      username: 'corgidisco',
      areas: {
        lat: 37,
        lng: 126,
      },
    }) // ok
    // endsection
  })
})

describe('sample array', () => {
  it('sample simple array', () => {
    expect.assertions(1)

    // section:sample-simple-array
    const validator = safen.sfl`{
      areas: {
        lat: number,
        lng: number,
      }[],
    }`

    validator.assert({
      areas: [], // empty is OK
    }) // ok

    validator.assert({
      areas: [
        { lat: 37, lng: 126 },
        { lat: 31, lng: 125 },
      ],
    }) // ok

    try {
      validator.assert({
        areas: '',
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        expect(e.errors).toEqual([
          {
            path: 'areas',
            reason: 'array',
            params: [],
            message: 'The areas must be an array.',
          },
        ])
      }
    }
    // endsection
  })

  it('sample array with range, fixed', () => {
    expect.assertions(2)

    // section:sample-array-with-range-fixed
    const validator = safen.sfl`{
      areas: {
        lat: number,
        lng: number,
      }[2],
    }`

    validator.assert({
      areas: [
        { lat: 37, lng: 126 },
        { lat: 31, lng: 125 },
      ],
    }) // ok

    try {
      validator.assert({
        areas: [
          { lat: 37, lng: 126 },
          { lat: 31, lng: 125 },
          { lat: 31, lng: 125 },
        ],
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        expect(e.errors).toEqual([
          {
            path: 'areas',
            reason: 'array_length',
            params: [2],
            message: 'The areas\'s length must be 2.',
          },
        ])
      }
    }

    try {
      validator.assert({
        areas: [
          { lat: 37, lng: 126 },
        ],
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        expect(e.errors).toEqual([
          {
            path: 'areas',
            reason: 'array_length',
            params: [2],
            message: 'The areas\'s length must be 2.',
          },
        ])
      }
    }
    // endsection
  })

  it('sample array with range, min', () => {
    expect.assertions(1)

    // section:sample-array-with-range-min
    const validator = safen.sfl`{
      areas: {
        lat: number,
        lng: number,
      }[1:],
    }`

    validator.assert({
      areas: [
        { lat: 31, lng: 125 },
      ],
    }) // ok

    validator.assert({
      areas: [
        { lat: 37, lng: 126 },
        { lat: 31, lng: 125 },
      ],
    }) // ok

    try {
      validator.assert({
        areas: [],
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        expect(e.errors).toEqual([
          {
            path: 'areas',
            reason: 'array_length_min',
            params: [1],
            message: 'The areas\'s length must be at least 1.',
          },
        ])
      }
    }
    // endsection
  })

  it('sample array with range, max', () => {
    expect.assertions(1)

    // section:sample-array-with-range-max
    const validator = safen.sfl`{
      areas: {
        lat: number,
        lng: number,
      }[:2],
    }`

    validator.assert({
      areas: [
        { lat: 31, lng: 125 },
      ],
    }) // ok

    validator.assert({
      areas: [
        { lat: 37, lng: 126 },
        { lat: 31, lng: 125 },
      ],
    }) // ok

    try {
      validator.assert({
        areas: [
          { lat: 37, lng: 126 },
          { lat: 31, lng: 125 },
          { lat: 32, lng: 121 },
        ],
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        expect(e.errors).toEqual([
          {
            path: 'areas',
            reason: 'array_length_max',
            params: [2],
            message: 'The areas\'s length may not be greater than 2.',
          },
        ])
      }
    }
    // endsection
  })

  it('sample array with range, between', () => {
    expect.assertions(2)

    // section:sample-array-with-range-between
    const validator = safen.sfl`{
      areas: {
        lat: number,
        lng: number,
      }[1:2],
    }`

    validator.assert({
      areas: [
        { lat: 31, lng: 125 },
      ],
    }) // ok

    validator.assert({
      areas: [
        { lat: 37, lng: 126 },
        { lat: 31, lng: 125 },
      ],
    }) // ok

    try {
      validator.assert({
        areas: [],
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        expect(e.errors).toEqual([
          {
            path: 'areas',
            reason: 'array_length_between',
            params: [1, 2],
            message: 'The areas\'s length must be between 1 and 2.',
          },
        ])
      }
    }

    try {
      validator.assert({
        areas: [
          { lat: 37, lng: 126 },
          { lat: 31, lng: 125 },
          { lat: 32, lng: 121 },
        ],
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        expect(e.errors).toEqual([
          {
            path: 'areas',
            reason: 'array_length_between',
            params: [1, 2],
            message: 'The areas\'s length must be between 1 and 2.',
          },
        ])
      }
    }
    // endsection
  })

  it('sample array with multi dims', () => {
    expect.assertions(1)

    // section:sample-array-with-multi-dims
    const validator = safen.sfl`{
      areas: {
        lat: number,
        lng: number,
      }[][],
    }`

    validator.assert({
      areas: [
        [
          { lat: 37, lng: 126 },
          { lat: 31, lng: 125 },
        ],
        [
          { lat: 37, lng: 126 },
          { lat: 31, lng: 125 },
        ],
      ],
    }) // ok

    try {
      validator.assert({
        areas: [
          { lat: 37, lng: 126 },
          { lat: 31, lng: 125 },
        ],
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        expect(e.errors).toEqual([
          {
            path: 'areas[0]',
            reason: 'array',
            params: [],
            message: 'The areas[0] must be an array.',
          },
          {
            path: 'areas[1]',
            reason: 'array',
            params: [],
            message: 'The areas[1] must be an array.',
          },
        ])
      }
    }
    // endsection
  })

  it('sample custom tester', () => {
    // section:sample-custom-tester
    const oddTester: safen.Tester = (value, params, gen) => {
      return `(Number.isInteger(${value}) && ${value} % 2 === 1)`
    }

    const evenTester: safen.Tester = (value, params, gen) => {
      return `(Number.isInteger(${value}) && ${value} % 2 === 0)`
    }

    const validation = safen.create(`{
      even: even,
      odd: odd,
    }`, {
      testers: {
        odd: oddTester,
        even: evenTester,
      },
    })

    expect(validation.validate({ even: 2, odd: 1 })).toBeTruthy()

    expect(validation.validate({ even: 1, odd: 1 })).toBeFalsy()
    expect(validation.validate({ even: 2, odd: 2 })).toBeFalsy()
    expect(validation.validate({ even: 1, odd: 2 })).toBeFalsy()

    // endsection
  })

  it('sample custom error messages', () => {
    expect.assertions(1)

    // section:sample-custom-error-messages
    const validator = safen.create(`{
      username: email,
    }`, {
      messages: {
        email: [
          'this is a custom error message in :path.', // exist `:path`
          'this is a custom error message.', // no `:path`
        ],
      },
    })

    try {
      validator.assert({
        username: 'corgidisco',
      }) // fail
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        expect(e.errors).toEqual([
          {
            path: 'username',
            reason: 'email',
            params: [],
            message: 'this is a custom error message in username.',
          },
        ])
      }
    }
    // endsection
  })

  it('sample custom error messages examples', () => {
    expect.assertions(1)

    // section:sample-custom-error-messages-examples
    const validator = safen.create(`{
      foo: email,
      bar: between(1, 2),
      baz: in("a", "b", "c"),
    }`, {
      messages: {
        required: ['The :path is required.', 'It is required.'],
        between: ['The :path must be between :param0 and :param1.', 'It must be between :param0 and :param1.'],
        in: ['The :path does not exist in :params.', 'It does not exist in :params.'],
      },
    })

    try {
      validator.assert({
        // foo
        bar: 4,
        baz: 'd',
      })
    } catch (e) {
      if (e instanceof safen.InvalidValueError) {
        expect(e.errors).toEqual([
          { path: 'foo', reason: 'required', params: [], message: 'The foo is required.' },
          { path: 'bar', reason: 'between', params: [1, 2], message: 'The bar must be between 1 and 2.' },
          { path: 'baz', reason: 'in', params: ['a', 'b', 'c'], message: 'The baz does not exist in ["a","b","c"].' },
        ])
      }
    }
    // endsection
  })
})

import "jest"

import * as safen from "../src"

describe("safen.create", () => {
  it("success", () => {
    const validator = safen.create("always_true")
    expect(validator.validate("")).toBeTruthy()
  })

  it("fail", () => {
    const validator = safen.create("always_false")
    expect(validator.validate("")).toBeFalsy()
  })
})

function expectErrorOccured(handler: any, types: string[]): void {
  try {
    handler()
  } catch (e) {
    if (e instanceof safen.InvalidValueError) {
      expect(e.reasons()).toEqual(types)
      return
    }
    console.log(e)
  }
  throw new Error("error")
}

function expectErrorNothing(handler: any): void {
  handler()
}

describe("test target name", () => {

  it("test simple", () => {
    const validator = safen.create("string")
    expectErrorNothing(() => validator.assert("string"))
    expectErrorOccured(() => validator.assert(null),      ["string"])
    expectErrorOccured(() => validator.assert(undefined), ["string"])
    expectErrorOccured(() => validator.assert([]),        ["string"])
    expectErrorOccured(() => validator.assert({}),        ["string"])
  })

  it("test multiple", () => {
    const validator = safen.create("string & email")
    expectErrorNothing(() => validator.assert("corgidisco@gmail.com"))
    expectErrorOccured(() => validator.assert("string"),  ["email"])
    expectErrorOccured(() => validator.assert(null),      ["string"])
    expectErrorOccured(() => validator.assert(undefined), ["string"])
    expectErrorOccured(() => validator.assert([]),        ["string"])
    expectErrorOccured(() => validator.assert({}),        ["string"])
  })

  it("test normal", () => {
    const validator = safen.create({users: "string"})
    expectErrorOccured(() => validator.assert({}),                  ["required@users"])
    expectErrorOccured(() => validator.assert({users: undefined}),  ["required@users"])
    expectErrorOccured(() => validator.assert({users: null}),       ["string@users"])
    expectErrorNothing(() => validator.assert({users: "user1"}))
    expectErrorOccured(() => validator.assert({users: []}),         ["string@users"])
    expectErrorOccured(() => validator.assert({users: ["user1"]}),  ["string@users"])
  })

  it("test array", () => {
    const validator = safen.create({"users[]": "string"})
    expectErrorOccured(() => validator.assert({}),                  ["required@users"])
    expectErrorOccured(() => validator.assert({users: undefined}),  ["required@users"])
    expectErrorOccured(() => validator.assert({users: null}),       ["array@users"])
    expectErrorOccured(() => validator.assert({users: "user1"}),    ["array@users"])
    expectErrorNothing(() => validator.assert({users: []}))
    expectErrorNothing(() => validator.assert({users: ["user1"]}))
  })

  it("test options", () => {
    const validator = safen.create({"users?": "string"})
    expectErrorNothing(() => validator.assert({}))
    expectErrorNothing(() => validator.assert({users: undefined}))
    expectErrorOccured(() => validator.assert({users: null}),       ["string@users"])
    expectErrorNothing(() => validator.assert({users: "user1"}))
    expectErrorOccured(() => validator.assert({users: []}),         ["string@users"])
    expectErrorOccured(() => validator.assert({users: ["user1"]}),  ["string@users"])
  })

  it("test array options", () => {
    const validator = safen.create({"users[]?": "string"})
    expectErrorNothing(() => validator.assert({}))
    expectErrorNothing(() => validator.assert({users: undefined}))
    expectErrorOccured(() => validator.assert({users: null}),     ["array@users"])
    expectErrorOccured(() => validator.assert({users: "user1"}),  ["array@users"])
    expectErrorNothing(() => validator.assert({users: []}))
    expectErrorNothing(() => validator.assert({users: ["user1"]}))
  })

  it("test array length", () => {
    const validator = safen.create({"users[2]": "string"})
    expectErrorOccured(() => validator.assert({users: []}),               ["array@users"])
    expectErrorOccured(() => validator.assert({users: ["1"]}),            ["array@users"])
    expectErrorNothing(() => validator.assert({users: ["1", "2"]}))
    expectErrorOccured(() => validator.assert({users: ["1", "2", "3"]}),  ["array@users"])
  })

  it("test array length max", () => {
    const validator = safen.create({"users[:2]": "string"})
    expectErrorNothing(() => validator.assert({users: []}))
    expectErrorNothing(() => validator.assert({users: ["1"]}))
    expectErrorNothing(() => validator.assert({users: ["1", "2"]}))
    expectErrorOccured(() => validator.assert({users: ["1", "2", "3"]}),  ["array@users"])
  })

  it("test array length min", () => {
    const validator = safen.create({"users[2:]": "string"})
    expectErrorOccured(() => validator.assert({users: []}),         ["array@users"])
    expectErrorOccured(() => validator.assert({users: ["1"]}),      ["array@users"])
    expectErrorNothing(() => validator.assert({users: ["1", "2"]}))
    expectErrorNothing(() => validator.assert({users: ["1", "2", "3"]}))
  })

  it("test array length between", () => {
    const validator = safen.create({"users[1:2]": "string"})
    expectErrorOccured(() => validator.assert({users: []}),               ["array@users"])
    expectErrorNothing(() => validator.assert({users: ["1"]}))
    expectErrorNothing(() => validator.assert({users: ["1", "2"]}))
    expectErrorOccured(() => validator.assert({users: ["1", "2", "3"]}),  ["array@users"])
  })
})

describe("load all testers", () => {
//   it("test after", () => {
//     expect(safen.create("after:2017-12-01 00:00:01").validate("2017-12-01 00:00:00")).toBeFalsy()
//     expect(safen.create("after:2017-12-01 00:00:01").validate("2017-12-01 00:00:01")).toBeFalsy()
//     expect(safen.create("after:2017-12-01 00:00:01").validate("2017-12-01 00:00:02")).toBeTruthy()
//   })

//   it("test alpha", () => {
//     expect(safen.create("alpha").validate("abcdefghijklmnopqrstuvwxyz")).toBeTruthy()
//     expect(safen.create("alpha").validate("1")).toBeFalsy()
//     expect(safen.create("alpha").validate("äbc")).toBeFalsy()
//     expect(safen.create("alpha:de-DE").validate("äbc")).toBeTruthy()
//     expect(safen.create("alpha:de-DE").validate("äbc1")).toBeFalsy()
//   })

//   it("test alphanum", () => {
//     expect(safen.create("alphanum").validate("abcdefghijklmnopqrstuvwxyz1")).toBeTruthy()
//     expect(safen.create("alphanum").validate("1")).toBeTruthy()
//     expect(safen.create("alphanum").validate("äbc1")).toBeFalsy()
//     expect(safen.create("alphanum:de-DE").validate("äbc1")).toBeTruthy()
//   })

  it("test always_false", () => {
    expect(safen.create("always_false").validate("abcdefghijklmnopqrstuvwxyz1")).toBeFalsy()
    expect(safen.create("always_false").validate("1")).toBeFalsy()
    expect(safen.create("always_false").validate("äbc1")).toBeFalsy()
  })

  it("test always_true", () => {
    expect(safen.create("always_true").validate("abcdefghijklmnopqrstuvwxyz1")).toBeTruthy()
    expect(safen.create("always_true").validate("1")).toBeTruthy()
    expect(safen.create("always_true").validate("äbc1")).toBeTruthy()
  })

//   it("test ascii", () => {
//     expect(safen.create("ascii").validate("abcdefghijklmnopqrstuvwxyz")).toBeTruthy()
//     expect(safen.create("ascii").validate("0123456789")).toBeTruthy()
//     expect(safen.create("ascii").validate("!@#$%^&*()")).toBeTruthy()
//     expect(safen.create("ascii").validate("äbc")).toBeFalsy()
//     expect(safen.create("ascii").validate("ｆｏｏ")).toBeFalsy()
//   })

//   it("test base64", () => {
//     expect(safen.create("base64").validate("Zg==")).toBeTruthy()
//     expect(safen.create("base64").validate("Zg=")).toBeFalsy()
//   })

//   it("test before", () => {
//     expect(safen.create("before:2017-12-01 00:00:01").validate("2017-12-01 00:00:00")).toBeTruthy()
//     expect(safen.create("before:2017-12-01 00:00:01").validate("2017-12-01 00:00:01")).toBeFalsy()
//     expect(safen.create("before:2017-12-01 00:00:01").validate("2017-12-01 00:00:02")).toBeFalsy()
//   })

  it("test between", () => {
    expect(safen.create("between:2,3").validate(1)).toBeFalsy()
    expect(safen.create("between:2,3").validate(2)).toBeTruthy()
    expect(safen.create("between:2,3").validate(3)).toBeTruthy()
    expect(safen.create("between:2,3").validate(4)).toBeFalsy()

    expect(safen.create("between:2,3").validate(11)).toBeFalsy()
    expect(safen.create("between:2,3").validate(22)).toBeFalsy()
    expect(safen.create("between:2,3").validate(33)).toBeFalsy()
    // expect(safen.create("between:2,3").validate("11")).toBeFalsy()
    // expect(safen.create("between:2,3").validate("22")).toBeTruthy()
    // expect(safen.create("between:2,3").validate("33")).toBeFalsy()
  })

//   it("test boolean", () => {
//     expect(safen.create("boolean").validate(true)).toBeTruthy()
//     expect(safen.create("boolean").validate(false)).toBeTruthy()
//     expect(safen.create("boolean").validate("true")).toBeFalsy()
//     expect(safen.create("boolean").validate("false")).toBeFalsy()
//     expect(safen.create("boolean").validate(1)).toBeFalsy()
//     expect(safen.create("boolean").validate(0)).toBeFalsy()
//   })

//   it("test boolean_string", () => {
//     expect(safen.create("boolean_string").validate("true")).toBeTruthy()
//     expect(safen.create("boolean_string").validate("false")).toBeTruthy()
//     expect(safen.create("boolean_string").validate("1")).toBeTruthy()
//     expect(safen.create("boolean_string").validate("0")).toBeTruthy()
//     expect(safen.create("boolean_string").validate(true)).toBeFalsy()
//     expect(safen.create("boolean_string").validate(false)).toBeFalsy()
//     expect(safen.create("boolean_string").validate(1)).toBeFalsy()
//     expect(safen.create("boolean_string").validate(0)).toBeFalsy()
//   })

//   it("test buffer", () => {
//     expect(safen.create("buffer").validate(new Buffer("hello world"))).toBeTruthy()
//     expect(safen.create("buffer").validate("string")).toBeFalsy()
//     expect(safen.create("buffer").validate(1)).toBeFalsy()
//   })

//   it("test creditcard", () => {
//     expect(safen.create("creditcard").validate("4716-2210-5188-5662")).toBeTruthy()
//     expect(safen.create("creditcard").validate("4929 7226 5379 7141")).toBeTruthy()
//     expect(safen.create("creditcard").validate("5398228707871528")).toBeFalsy()
//   })

//   it("test data_uri", () => {
//     expect(safen.create("data_uri").validate("data:text/html;charset=US-ASCII,%3Ch1%3EHello!%3C%2Fh1%3E")).toBeTruthy()
//     expect(safen.create("data_uri").validate("data:HelloWorld")).toBeFalsy()
//   })

//   it("test decimal_string", () => {
//     expect(safen.create("decimal_string").validate("30000")).toBeTruthy()
//     expect(safen.create("decimal_string").validate("3.0001")).toBeTruthy()
//     expect(safen.create("decimal_string").validate("0,001")).toBeFalsy()
//   })

//   it("test domain", () => {
//     expect(safen.create("domain").validate("domain.com")).toBeTruthy()
//     expect(safen.create("domain").validate("hello.xn--froschgrn-x9a.com")).toBeTruthy()
//     expect(safen.create("domain").validate("123.123.123.123")).toBeFalsy()
//   })

  it("test email", () => {
    expect(safen.create("email").validate("corgidisco@gmail.com")).toBeTruthy()
    expect(safen.create("email").validate("corgidisco+en@gmail.com")).toBeTruthy()
    expect(safen.create("email").validate("corgi.disco@gmail.com")).toBeTruthy()
    expect(safen.create("email").validate("corgidisco")).toBeFalsy()
  })

//   it("test finite", () => {
//     expect(safen.create("finite").validate(100)).toBeTruthy()
//     expect(safen.create("finite").validate(100.1)).toBeTruthy()
//     expect(safen.create("finite").validate(NaN)).toBeFalsy()
//     expect(safen.create("finite").validate(Infinity)).toBeFalsy()
//   })

//   it("test finite", () => {
//     expect(safen.create("finite").validate(100)).toBeTruthy()
//     expect(safen.create("finite").validate(100.1)).toBeTruthy()
//     expect(safen.create("finite").validate(NaN)).toBeFalsy()
//     expect(safen.create("finite").validate(Infinity)).toBeFalsy()
//   })

//   it("test hash", () => {
//     expect(safen.create("hash:md5").validate("d94f3f01")).toBeFalsy()
//     expect(safen.create("hash:md5").validate("d94f3f016ae679c3008de268209132f2")).toBeTruthy()
//     expect(safen.create("hash:crc32").validate("d94f3f016ae679c3008de268209132f2")).toBeFalsy()
//     expect(safen.create("hash:crc32").validate("d94f3f01")).toBeTruthy()
//   })

//   it("test hexcolor", () => {
//     expect(safen.create("hexcolor").validate("#CCCCCC")).toBeTruthy()
//     expect(safen.create("hexcolor").validate("#ff")).toBeFalsy()
//   })

//   it("test hexadecimal", () => {
//     expect(safen.create("hexadecimal").validate("abcdef")).toBeTruthy()
//     expect(safen.create("hexadecimal").validate("abcdefg")).toBeFalsy()
//   })

  it("test in", () => {
    // expect(safen.create("in:a,b,c").validate("a")).toBeTruthy()
    // expect(safen.create("in:a,b,c").validate("d")).toBeFalsy()
    expect(safen.create("in:1,2,3").validate(1)).toBeTruthy()
    expect(safen.create("in:1,2,3").validate(4)).toBeFalsy()
    // expect(safen.create("in:1.1,2.2,3.3").validate(1.1)).toBeTruthy()
    // expect(safen.create("in:1.1,2.2,3.3").validate(4.4)).toBeFalsy()
  })

  it("test integer", () => {
    expect(safen.create("integer").validate(100)).toBeTruthy()
    expect(safen.create("integer").validate(100.1)).toBeFalsy()
  })

//   it("test ip", () => {
//     expect(safen.create("ip").validate("127.0.0.1")).toBeTruthy()
//     expect(safen.create("ip").validate("2001:db8:0000:1:1:1:1:1")).toBeTruthy()
//     expect(safen.create("ip").validate("256.0.0.0")).toBeFalsy()

//     expect(safen.create("ip:v4").validate("127.0.0.1")).toBeTruthy()
//     expect(safen.create("ip:v4").validate("2001:db8:0000:1:1:1:1:1")).toBeFalsy()
//     expect(safen.create("ip:v6").validate("127.0.0.1")).toBeFalsy()
//     expect(safen.create("ip:v6").validate("2001:db8:0000:1:1:1:1:1")).toBeTruthy()
//   })

//   it("test isbn", () => {
//     expect(safen.create("isbn").validate("3-8362-2119-5")).toBeTruthy()
//     expect(safen.create("isbn").validate("978-3-8362-2119-1")).toBeTruthy()

//     expect(safen.create("isbn:v10").validate("3-8362-2119-5")).toBeTruthy()
//     expect(safen.create("isbn:v10").validate("978-3-8362-2119-1")).toBeFalsy()
//     expect(safen.create("isbn:v13").validate("3-8362-2119-5")).toBeFalsy()
//     expect(safen.create("isbn:v13").validate("978-3-8362-2119-1")).toBeTruthy()
//   })

//   it("test issn", () => {
//     expect(safen.create("issn").validate("0378-5955")).toBeTruthy()
//     expect(safen.create("issn").validate("0378-5954")).toBeFalsy()
//   })

//   it("test isin", () => {
//     expect(safen.create("isin").validate("AU0000XVGZA3")).toBeTruthy()
//     expect(safen.create("isin").validate("DE000BAY0018")).toBeFalsy()
//   })

//   it("test isrc", () => {
//     expect(safen.create("isrc").validate("USAT29900609")).toBeTruthy()
//     expect(safen.create("isrc").validate("USAT2990060")).toBeFalsy()
//   })

//   it("test json", () => {
//     expect(safen.create("json").validate("{}")).toBeTruthy()
//     expect(safen.create("json").validate("asdf")).toBeFalsy()
//   })

//   it("test lowercase", () => {
//     expect(safen.create("lowercase").validate("abcd")).toBeTruthy()
//     expect(safen.create("lowercase").validate("abcD")).toBeFalsy()
//   })

  it("test length", () => {
    expect(safen.create("length:3").validate("abc")).toBeTruthy()
    expect(safen.create("length:3").validate("abcd")).toBeFalsy()
    expect(safen.create("length:3").validate([1, 2, 3])).toBeTruthy()
    expect(safen.create("length:3").validate([1, 2, 3, 4])).toBeFalsy()
  })

  it("test length_between", () => {
    expect(safen.create("length_between:2,3").validate("a")).toBeFalsy()
    expect(safen.create("length_between:2,3").validate("ab")).toBeTruthy()
    expect(safen.create("length_between:2,3").validate("abc")).toBeTruthy()
    expect(safen.create("length_between:2,3").validate("abcd")).toBeFalsy()
    expect(safen.create("length_between:2,3").validate([1])).toBeFalsy()
    expect(safen.create("length_between:2,3").validate([1, 2])).toBeTruthy()
    expect(safen.create("length_between:2,3").validate([1, 2, 3])).toBeTruthy()
    expect(safen.create("length_between:2,3").validate([1, 2, 3, 4])).toBeFalsy()
  })

  it("test length_max", () => {
    expect(safen.create("length_max:3").validate("ab")).toBeTruthy()
    expect(safen.create("length_max:3").validate("abc")).toBeTruthy()
    expect(safen.create("length_max:3").validate("abcd")).toBeFalsy()
    expect(safen.create("length_max:3").validate([1, 2])).toBeTruthy()
    expect(safen.create("length_max:3").validate([1, 2, 3])).toBeTruthy()
    expect(safen.create("length_max:3").validate([1, 2, 3, 4])).toBeFalsy()
  })

  it("test length_min", () => {
    expect(safen.create("length_min:2").validate("a")).toBeFalsy()
    expect(safen.create("length_min:2").validate("ab")).toBeTruthy()
    expect(safen.create("length_min:2").validate("abc")).toBeTruthy()
    expect(safen.create("length_min:2").validate([1])).toBeFalsy()
    expect(safen.create("length_min:2").validate([1, 2])).toBeTruthy()
    expect(safen.create("length_min:2").validate([1, 2, 3])).toBeTruthy()
  })

//   it("test macaddress", () => {
//     expect(safen.create("macaddress").validate("ab:ab:ab:ab:ab:ab")).toBeTruthy()
//     expect(safen.create("macaddress").validate("01:02:03:04:05")).toBeFalsy()
//   })

//   it("test map", () => {
//     expect(safen.create("map").validate(new Map())).toBeTruthy()
//     expect(safen.create("map").validate([])).toBeFalsy()
//   })

  it("test max", () => {
    expect(safen.create("max:3").validate(2)).toBeTruthy()
    expect(safen.create("max:3").validate(3)).toBeTruthy()
    expect(safen.create("max:3").validate(4)).toBeFalsy()

    expect(safen.create("max:3").validate(22)).toBeFalsy()
    expect(safen.create("max:3").validate(33)).toBeFalsy()
    // expect(safen.create("max:3").validate("22")).toBeTruthy()
    // expect(safen.create("max:3").validate("33")).toBeFalsy()
  })

  it("test min", () => {
    expect(safen.create("min:2").validate(1)).toBeFalsy()
    expect(safen.create("min:2").validate(2)).toBeTruthy()
    expect(safen.create("min:2").validate(3)).toBeTruthy()

    expect(safen.create("min:2").validate(11)).toBeTruthy()
    expect(safen.create("min:2").validate(22)).toBeTruthy()
    // expect(safen.create("min:2").validate("11")).toBeFalsy()
    // expect(safen.create("min:2").validate("22")).toBeTruthy()
  })

//   it("test mobilephone", () => {
//     expect(safen.create("mobilephone:de-DE").validate("+49 01234567890")).toBeTruthy()
//   })

//   it("test mongoid", () => {
//     expect(safen.create("mongoid").validate("507f1f77bcf86cd799439011")).toBeTruthy()
//     expect(safen.create("mongoid").validate("507f1f77bcf86cd7994390")).toBeFalsy()
//   })

//   it("test nan", () => {
//     expect(safen.create("nan").validate(NaN)).toBeTruthy()
//     expect(safen.create("nan").validate(Infinity)).toBeFalsy()
//     expect(safen.create("nan").validate(1)).toBeFalsy()
//   })

//   it("test number", () => {
//     expect(safen.create("number").validate(NaN)).toBeTruthy()
//     expect(safen.create("number").validate(Infinity)).toBeTruthy()
//     expect(safen.create("number").validate(1)).toBeTruthy()
//     expect(safen.create("number").validate("abc")).toBeFalsy()
//   })

//   it("test number_string", () => {
//     expect(safen.create("number_string").validate("100")).toBeTruthy()
//     expect(safen.create("number_string").validate("abc")).toBeFalsy()
//   })

//   it("test object", () => {
//     expect(safen.create("object").validate({})).toBeTruthy()
//     expect(safen.create("object").validate("abc")).toBeFalsy()
//   })

//   it("test postalcode", () => {
//     expect(safen.create("postalcode:FR").validate("75008")).toBeTruthy()
//     expect(safen.create("postalcode:FR").validate("DE993GG")).toBeFalsy()
//   })

//   it("test set", () => {
//     expect(safen.create("set").validate(new Set())).toBeTruthy()
//     expect(safen.create("set").validate(new Map())).toBeFalsy()
//   })

  it("test string", () => {
    expect(safen.create("string").validate("string")).toBeTruthy()
    expect(safen.create("string").validate(12345678)).toBeFalsy()
  })

//   it("test symbol", () => {
//     expect(safen.create("symbol").validate(Symbol("symbol"))).toBeTruthy()
//     expect(safen.create("symbol").validate(12345678)).toBeFalsy()
//   })

//   it("test uppercase", () => {
//     expect(safen.create("uppercase").validate("ABCD")).toBeTruthy()
//     expect(safen.create("uppercase").validate("abcD")).toBeFalsy()
//   })

//   it("test url", () => {
//     expect(safen.create("url").validate("http://github.com/corgidisco")).toBeTruthy()
//     expect(safen.create("url").validate("github.com")).toBeTruthy()
//     expect(safen.create("url").validate("github")).toBeFalsy()
//   })

//   it("test uuid", () => {
//     expect(safen.create("uuid").validate("A987FBC9-4BED-3078-CF07-9141BA07C9F3")).toBeTruthy()
//     expect(safen.create("uuid").validate("xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3")).toBeFalsy()
//   })
})

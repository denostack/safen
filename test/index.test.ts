
import {} from "jest"

import safen from "../dist"
import {InvalidValueError} from "../dist"

describe("safen.create", () => {
  it("success", () => {
    const validator = safen.create("always_true")
    expect(validator.validate("")).toBe(true)
  })

  it("fail", () => {
    const validator = safen.create("always_false")
    expect(validator.validate("")).toBe(false)
  })
})

function expectErrorOccured(handler: any, types: string[]): void {
  try {
    handler()
  } catch (e) {
    if (e instanceof InvalidValueError) {
      expect(e.getErrors()).toEqual(types)
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
    expectErrorNothing(() => safen.create("string").assert("user1"))
    expectErrorOccured(() => safen.create("string").assert(undefined),  ["string"])
    expectErrorOccured(() => safen.create("string").assert(null),       ["string"])
    expectErrorOccured(() => safen.create("string").assert([]),         ["string"])
    expectErrorOccured(() => safen.create("string").assert({}),         ["string"])
  })

  it("test multiple", () => {
    expectErrorNothing(() => safen.create("string | email").assert("corgidisco@gmail.com"))
    expectErrorOccured(() => safen.create("string | email").assert(undefined),  ["string", "email"])
    expectErrorOccured(() => safen.create("string | email").assert(null),       ["string", "email"])
    expectErrorOccured(() => safen.create("string | email").assert([]),         ["string", "email"])
    expectErrorOccured(() => safen.create("string | email").assert({}),         ["string", "email"])
  })

  // it("test array", () => {
  //   expectErrorNothing(() => safen.create("string[]").assert("corgidisco@gmail.com"))
  //   expectErrorOccured(() => safen.create("string[]").assert(undefined),  ["string"])
  //   expectErrorOccured(() => safen.create("string[]").assert(null),       ["string"])
  //   expectErrorOccured(() => safen.create("string[]").assert([]),         ["string"])
  //   expectErrorOccured(() => safen.create("string[]").assert({}),         ["string"])
  // })

  // it("test array of multiple", () => {
  //   expectErrorNothing(() => safen.create("string | email []").assert("corgidisco@gmail.com"))
  //   expectErrorOccured(() => safen.create("string | email []").assert(undefined),  ["string"])
  //   expectErrorOccured(() => safen.create("string | email []").assert(null),       ["string"])
  //   expectErrorOccured(() => safen.create("string | email []").assert([]),         ["string"])
  //   expectErrorOccured(() => safen.create("string | email []").assert({}),         ["string"])
  // })

  it("test normal", () => {
    expectErrorOccured(() => safen.create({users: "string"}).assert({}),                  ["required@users"])
    expectErrorOccured(() => safen.create({users: "string"}).assert({users: undefined}),  ["required@users"])
    expectErrorOccured(() => safen.create({users: "string"}).assert({users: null}),       ["required@users"])
    expectErrorNothing(() => safen.create({users: "string"}).assert({users: "user1"}))
    expectErrorOccured(() => safen.create({users: "string"}).assert({users: []}),         ["string@users"])
    expectErrorOccured(() => safen.create({users: "string"}).assert({users: ["user1"]}),  ["string@users"])
  })

  it("test array", () => {
    expectErrorOccured(() => safen.create({"users[]": "string"}).assert({}),                  ["required@users"])
    expectErrorOccured(() => safen.create({"users[]": "string"}).assert({users: undefined}),  ["required@users"])
    expectErrorOccured(() => safen.create({"users[]": "string"}).assert({users: null}),       ["required@users"])
    expectErrorOccured(() => safen.create({"users[]": "string"}).assert({users: "user1"}),    ["array@users"])
    expectErrorNothing(() => safen.create({"users[]": "string"}).assert({users: []}))
    expectErrorNothing(() => safen.create({"users[]": "string"}).assert({users: ["user1"]}))
  })

  it("test options", () => {
    expectErrorNothing(() => safen.create({"users?": "string"}).assert({}))
    expectErrorNothing(() => safen.create({"users?": "string"}).assert({users: undefined}))
    expectErrorNothing(() => safen.create({"users?": "string"}).assert({users: null}))
    expectErrorNothing(() => safen.create({"users?": "string"}).assert({users: "user1"}))
    expectErrorOccured(() => safen.create({"users?": "string"}).assert({users: []}),        ["string@users"])
    expectErrorOccured(() => safen.create({"users?": "string"}).assert({users: ["user1"]}), ["string@users"])
  })

  it("test array options", () => {
    expectErrorNothing(() => safen.create({"users[]?": "string"}).assert({}))
    expectErrorNothing(() => safen.create({"users[]?": "string"}).assert({users: undefined}))
    expectErrorNothing(() => safen.create({"users[]?": "string"}).assert({users: null}))
    expectErrorOccured(() => safen.create({"users[]?": "string"}).assert({users: "user1"}), ["array@users"])
    expectErrorNothing(() => safen.create({"users[]?": "string"}).assert({users: []}))
    expectErrorNothing(() => safen.create({"users[]?": "string"}).assert({users: ["user1"]}))
  })

  it("test array length", () => {
    expectErrorOccured(() => safen.create({"users[2]": "string"}).assert({users: []}),              ["array_length:2@users"])
    expectErrorOccured(() => safen.create({"users[2]": "string"}).assert({users: ["1"]}),           ["array_length:2@users"])
    expectErrorNothing(() => safen.create({"users[2]": "string"}).assert({users: ["1", "2"]}))
    expectErrorOccured(() => safen.create({"users[2]": "string"}).assert({users: ["1", "2", "3"]}), ["array_length:2@users"])

    expectErrorNothing(() => safen.create({"users[:2]": "string"}).assert({users: []}))
    expectErrorNothing(() => safen.create({"users[:2]": "string"}).assert({users: ["1"]}))
    expectErrorNothing(() => safen.create({"users[:2]": "string"}).assert({users: ["1", "2"]}))
    expectErrorOccured(() => safen.create({"users[:2]": "string"}).assert({users: ["1", "2", "3"]}), ["array_length_max:2@users"])

    expectErrorOccured(() => safen.create({"users[2:]": "string"}).assert({users: []}),         ["array_length_min:2@users"])
    expectErrorOccured(() => safen.create({"users[2:]": "string"}).assert({users: ["1"]}),      ["array_length_min:2@users"])
    expectErrorNothing(() => safen.create({"users[2:]": "string"}).assert({users: ["1", "2"]}))
    expectErrorNothing(() => safen.create({"users[2:]": "string"}).assert({users: ["1", "2", "3"]}))

    expectErrorOccured(() => safen.create({"users[1:2]": "string"}).assert({users: []}),              ["array_length_between:1,2@users"])
    expectErrorNothing(() => safen.create({"users[1:2]": "string"}).assert({users: ["1"]}))
    expectErrorNothing(() => safen.create({"users[1:2]": "string"}).assert({users: ["1", "2"]}))
    expectErrorOccured(() => safen.create({"users[1:2]": "string"}).assert({users: ["1", "2", "3"]}), ["array_length_between:1,2@users"])
  })
})

describe("load all testers", () => {
  it("test after", () => {
    expect(safen.create("after:2017-12-01 00:00:01").validate("2017-12-01 00:00:00")).toBe(false)
    expect(safen.create("after:2017-12-01 00:00:01").validate("2017-12-01 00:00:01")).toBe(false)
    expect(safen.create("after:2017-12-01 00:00:01").validate("2017-12-01 00:00:02")).toBe(true)
  })

  it("test alpha", () => {
    expect(safen.create("alpha").validate("abcdefghijklmnopqrstuvwxyz")).toBe(true)
    expect(safen.create("alpha").validate("1")).toBe(false)
    expect(safen.create("alpha").validate("äbc")).toBe(false)
    expect(safen.create("alpha:de-DE").validate("äbc")).toBe(true)
    expect(safen.create("alpha:de-DE").validate("äbc1")).toBe(false)
  })

  it("test alphanum", () => {
    expect(safen.create("alphanum").validate("abcdefghijklmnopqrstuvwxyz1")).toBe(true)
    expect(safen.create("alphanum").validate("1")).toBe(true)
    expect(safen.create("alphanum").validate("äbc1")).toBe(false)
    expect(safen.create("alphanum:de-DE").validate("äbc1")).toBe(true)
  })

  it("test always_false", () => {
    expect(safen.create("always_false").validate("abcdefghijklmnopqrstuvwxyz1")).toBe(false)
    expect(safen.create("always_false").validate("1")).toBe(false)
    expect(safen.create("always_false").validate("äbc1")).toBe(false)
  })

  it("test always_true", () => {
    expect(safen.create("always_true").validate("abcdefghijklmnopqrstuvwxyz1")).toBe(true)
    expect(safen.create("always_true").validate("1")).toBe(true)
    expect(safen.create("always_true").validate("äbc1")).toBe(true)
  })

  it("test ascii", () => {
    expect(safen.create("ascii").validate("abcdefghijklmnopqrstuvwxyz")).toBe(true)
    expect(safen.create("ascii").validate("0123456789")).toBe(true)
    expect(safen.create("ascii").validate("!@#$%^&*()")).toBe(true)
    expect(safen.create("ascii").validate("äbc")).toBe(false)
    expect(safen.create("ascii").validate("ｆｏｏ")).toBe(false)
  })

  it("test base64", () => {
    expect(safen.create("base64").validate("Zg==")).toBe(true)
    expect(safen.create("base64").validate("Zg=")).toBe(false)
  })

  it("test before", () => {
    expect(safen.create("before:2017-12-01 00:00:01").validate("2017-12-01 00:00:00")).toBe(true)
    expect(safen.create("before:2017-12-01 00:00:01").validate("2017-12-01 00:00:01")).toBe(false)
    expect(safen.create("before:2017-12-01 00:00:01").validate("2017-12-01 00:00:02")).toBe(false)
  })

  it("test between", () => {
    expect(safen.create("between:2,3").validate(1)).toBe(false)
    expect(safen.create("between:2,3").validate(2)).toBe(true)
    expect(safen.create("between:2,3").validate(3)).toBe(true)
    expect(safen.create("between:2,3").validate(4)).toBe(false)

    expect(safen.create("between:2,3").validate(11)).toBe(false)
    expect(safen.create("between:2,3").validate(22)).toBe(false)
    expect(safen.create("between:2,3").validate(33)).toBe(false)
    expect(safen.create("between:2,3").validate("11")).toBe(false)
    expect(safen.create("between:2,3").validate("22")).toBe(true)
    expect(safen.create("between:2,3").validate("33")).toBe(false)
  })

  it("test boolean", () => {
    expect(safen.create("boolean").validate(true)).toBe(true)
    expect(safen.create("boolean").validate(false)).toBe(true)
    expect(safen.create("boolean").validate("true")).toBe(false)
    expect(safen.create("boolean").validate("false")).toBe(false)
    expect(safen.create("boolean").validate(1)).toBe(false)
    expect(safen.create("boolean").validate(0)).toBe(false)
  })

  it("test boolean_string", () => {
    expect(safen.create("boolean_string").validate("true")).toBe(true)
    expect(safen.create("boolean_string").validate("false")).toBe(true)
    expect(safen.create("boolean_string").validate("1")).toBe(true)
    expect(safen.create("boolean_string").validate("0")).toBe(true)
    expect(safen.create("boolean_string").validate(true)).toBe(false)
    expect(safen.create("boolean_string").validate(false)).toBe(false)
    expect(safen.create("boolean_string").validate(1)).toBe(false)
    expect(safen.create("boolean_string").validate(0)).toBe(false)
  })

  it("test buffer", () => {
    expect(safen.create("buffer").validate(new Buffer("hello world"))).toBe(true)
    expect(safen.create("buffer").validate("string")).toBe(false)
    expect(safen.create("buffer").validate(1)).toBe(false)
  })

  it("test creditcard", () => {
    expect(safen.create("creditcard").validate("4716-2210-5188-5662")).toBe(true)
    expect(safen.create("creditcard").validate("4929 7226 5379 7141")).toBe(true)
    expect(safen.create("creditcard").validate("5398228707871528")).toBe(false)
  })

  it("test data_uri", () => {
    expect(safen.create("data_uri").validate("data:text/html;charset=US-ASCII,%3Ch1%3EHello!%3C%2Fh1%3E")).toBe(true)
    expect(safen.create("data_uri").validate("data:HelloWorld")).toBe(false)
  })

  it("test decimal_string", () => {
    expect(safen.create("decimal_string").validate("30000")).toBe(true)
    expect(safen.create("decimal_string").validate("3.0001")).toBe(true)
    expect(safen.create("decimal_string").validate("0,001")).toBe(false)
  })

  it("test domain", () => {
    expect(safen.create("domain").validate("domain.com")).toBe(true)
    expect(safen.create("domain").validate("hello.xn--froschgrn-x9a.com")).toBe(true)
    expect(safen.create("domain").validate("123.123.123.123")).toBe(false)
  })

  it("test email", () => {
    expect(safen.create("email").validate("corgidisco@gmail.com")).toBe(true)
    expect(safen.create("email").validate("corgidisco+en@gmail.com")).toBe(true)
    expect(safen.create("email").validate("corgi.disco@gmail.com")).toBe(true)
    expect(safen.create("email").validate("corgidisco")).toBe(false)
  })

  it("test finite", () => {
    expect(safen.create("finite").validate(100)).toBe(true)
    expect(safen.create("finite").validate(100.1)).toBe(true)
    expect(safen.create("finite").validate(NaN)).toBe(false)
    expect(safen.create("finite").validate(Infinity)).toBe(false)
  })

  it("test finite", () => {
    expect(safen.create("finite").validate(100)).toBe(true)
    expect(safen.create("finite").validate(100.1)).toBe(true)
    expect(safen.create("finite").validate(NaN)).toBe(false)
    expect(safen.create("finite").validate(Infinity)).toBe(false)
  })

  it("test hash", () => {
    expect(safen.create("hash:md5").validate("d94f3f01")).toBe(false)
    expect(safen.create("hash:md5").validate("d94f3f016ae679c3008de268209132f2")).toBe(true)
    expect(safen.create("hash:crc32").validate("d94f3f016ae679c3008de268209132f2")).toBe(false)
    expect(safen.create("hash:crc32").validate("d94f3f01")).toBe(true)
  })

  it("test hexcolor", () => {
    expect(safen.create("hexcolor").validate("#CCCCCC")).toBe(true)
    expect(safen.create("hexcolor").validate("#ff")).toBe(false)
  })

  it("test hexadecimal", () => {
    expect(safen.create("hexadecimal").validate("abcdef")).toBe(true)
    expect(safen.create("hexadecimal").validate("abcdefg")).toBe(false)
  })

  it("test in", () => {
    expect(safen.create("in:a,b,c").validate("a")).toBe(true)
    expect(safen.create("in:a,b,c").validate("d")).toBe(false)
    expect(safen.create("in:1,2,3").validate(1)).toBe(true)
    expect(safen.create("in:1,2,3").validate(4)).toBe(false)
    expect(safen.create("in:1.1,2.2,3.3").validate(1.1)).toBe(true)
    expect(safen.create("in:1.1,2.2,3.3").validate(4.4)).toBe(false)
  })

  it("test integer", () => {
    expect(safen.create("integer").validate(100)).toBe(true)
    expect(safen.create("integer").validate(100.1)).toBe(false)
  })

  it("test ip", () => {
    expect(safen.create("ip").validate("127.0.0.1")).toBe(true)
    expect(safen.create("ip").validate("2001:db8:0000:1:1:1:1:1")).toBe(true)
    expect(safen.create("ip").validate("256.0.0.0")).toBe(false)

    expect(safen.create("ip:v4").validate("127.0.0.1")).toBe(true)
    expect(safen.create("ip:v4").validate("2001:db8:0000:1:1:1:1:1")).toBe(false)
    expect(safen.create("ip:v6").validate("127.0.0.1")).toBe(false)
    expect(safen.create("ip:v6").validate("2001:db8:0000:1:1:1:1:1")).toBe(true)
  })

  it("test isbn", () => {
    expect(safen.create("isbn").validate("3-8362-2119-5")).toBe(true)
    expect(safen.create("isbn").validate("978-3-8362-2119-1")).toBe(true)

    expect(safen.create("isbn:v10").validate("3-8362-2119-5")).toBe(true)
    expect(safen.create("isbn:v10").validate("978-3-8362-2119-1")).toBe(false)
    expect(safen.create("isbn:v13").validate("3-8362-2119-5")).toBe(false)
    expect(safen.create("isbn:v13").validate("978-3-8362-2119-1")).toBe(true)
  })

  it("test issn", () => {
    expect(safen.create("issn").validate("0378-5955")).toBe(true)
    expect(safen.create("issn").validate("0378-5954")).toBe(false)
  })

  it("test isin", () => {
    expect(safen.create("isin").validate("AU0000XVGZA3")).toBe(true)
    expect(safen.create("isin").validate("DE000BAY0018")).toBe(false)
  })

  it("test isrc", () => {
    expect(safen.create("isrc").validate("USAT29900609")).toBe(true)
    expect(safen.create("isrc").validate("USAT2990060")).toBe(false)
  })

  it("test json", () => {
    expect(safen.create("json").validate("{}")).toBe(true)
    expect(safen.create("json").validate("asdf")).toBe(false)
  })

  it("test lowercase", () => {
    expect(safen.create("lowercase").validate("abcd")).toBe(true)
    expect(safen.create("lowercase").validate("abcD")).toBe(false)
  })

  it("test length", () => {
    expect(safen.create("length:3").validate("abc")).toBe(true)
    expect(safen.create("length:3").validate("abcd")).toBe(false)
    expect(safen.create("length:3").validate([1, 2, 3])).toBe(true)
    expect(safen.create("length:3").validate([1, 2, 3, 4])).toBe(false)
  })

  it("test length_between", () => {
    expect(safen.create("length_between:2,3").validate("a")).toBe(false)
    expect(safen.create("length_between:2,3").validate("ab")).toBe(true)
    expect(safen.create("length_between:2,3").validate("abc")).toBe(true)
    expect(safen.create("length_between:2,3").validate("abcd")).toBe(false)
    expect(safen.create("length_between:2,3").validate([1])).toBe(false)
    expect(safen.create("length_between:2,3").validate([1, 2])).toBe(true)
    expect(safen.create("length_between:2,3").validate([1, 2, 3])).toBe(true)
    expect(safen.create("length_between:2,3").validate([1, 2, 3, 4])).toBe(false)
  })

  it("test length_max", () => {
    expect(safen.create("length_max:3").validate("ab")).toBe(true)
    expect(safen.create("length_max:3").validate("abc")).toBe(true)
    expect(safen.create("length_max:3").validate("abcd")).toBe(false)
    expect(safen.create("length_max:3").validate([1, 2])).toBe(true)
    expect(safen.create("length_max:3").validate([1, 2, 3])).toBe(true)
    expect(safen.create("length_max:3").validate([1, 2, 3, 4])).toBe(false)
  })

  it("test length_min", () => {
    expect(safen.create("length_min:2").validate("a")).toBe(false)
    expect(safen.create("length_min:2").validate("ab")).toBe(true)
    expect(safen.create("length_min:2").validate("abc")).toBe(true)
    expect(safen.create("length_min:2").validate([1])).toBe(false)
    expect(safen.create("length_min:2").validate([1, 2])).toBe(true)
    expect(safen.create("length_min:2").validate([1, 2, 3])).toBe(true)
  })

  it("test macaddress", () => {
    expect(safen.create("macaddress").validate("ab:ab:ab:ab:ab:ab")).toBe(true)
    expect(safen.create("macaddress").validate("01:02:03:04:05")).toBe(false)
  })

  it("test map", () => {
    expect(safen.create("map").validate(new Map())).toBe(true)
    expect(safen.create("map").validate([])).toBe(false)
  })

  it("test max", () => {
    expect(safen.create("max:3").validate(2)).toBe(true)
    expect(safen.create("max:3").validate(3)).toBe(true)
    expect(safen.create("max:3").validate(4)).toBe(false)

    expect(safen.create("max:3").validate(22)).toBe(false)
    expect(safen.create("max:3").validate(33)).toBe(false)
    expect(safen.create("max:3").validate("22")).toBe(true)
    expect(safen.create("max:3").validate("33")).toBe(false)
  })

  it("test min", () => {
    expect(safen.create("min:2").validate(1)).toBe(false)
    expect(safen.create("min:2").validate(2)).toBe(true)
    expect(safen.create("min:2").validate(3)).toBe(true)

    expect(safen.create("min:2").validate(11)).toBe(true)
    expect(safen.create("min:2").validate(22)).toBe(true)
    expect(safen.create("min:2").validate("11")).toBe(false)
    expect(safen.create("min:2").validate("22")).toBe(true)
  })

  it("test mobilephone", () => {
    expect(safen.create("mobilephone:de-DE").validate("+49 01234567890")).toBe(true)
  })

  it("test mongoid", () => {
    expect(safen.create("mongoid").validate("507f1f77bcf86cd799439011")).toBe(true)
    expect(safen.create("mongoid").validate("507f1f77bcf86cd7994390")).toBe(false)
  })

  it("test nan", () => {
    expect(safen.create("nan").validate(NaN)).toBe(true)
    expect(safen.create("nan").validate(Infinity)).toBe(false)
    expect(safen.create("nan").validate(1)).toBe(false)
  })

  it("test number", () => {
    expect(safen.create("number").validate(NaN)).toBe(true)
    expect(safen.create("number").validate(Infinity)).toBe(true)
    expect(safen.create("number").validate(1)).toBe(true)
    expect(safen.create("number").validate("abc")).toBe(false)
  })

  it("test number_string", () => {
    expect(safen.create("number_string").validate("100")).toBe(true)
    expect(safen.create("number_string").validate("abc")).toBe(false)
  })

  it("test object", () => {
    expect(safen.create("object").validate({})).toBe(true)
    expect(safen.create("object").validate("abc")).toBe(false)
  })

  it("test postalcode", () => {
    expect(safen.create("postalcode:FR").validate("75008")).toBe(true)
    expect(safen.create("postalcode:FR").validate("DE993GG")).toBe(false)
  })

  it("test set", () => {
    expect(safen.create("set").validate(new Set())).toBe(true)
    expect(safen.create("set").validate(new Map())).toBe(false)
  })

  it("test string", () => {
    expect(safen.create("string").validate("string")).toBe(true)
    expect(safen.create("string").validate(12345678)).toBe(false)
  })

  it("test symbol", () => {
    expect(safen.create("symbol").validate(Symbol("symbol"))).toBe(true)
    expect(safen.create("symbol").validate(12345678)).toBe(false)
  })

  it("test uppercase", () => {
    expect(safen.create("uppercase").validate("ABCD")).toBe(true)
    expect(safen.create("uppercase").validate("abcD")).toBe(false)
  })

  it("test url", () => {
    expect(safen.create("url").validate("http://github.com/corgidisco")).toBe(true)
    expect(safen.create("url").validate("github.com")).toBe(true)
    expect(safen.create("url").validate("github")).toBe(false)
  })

  it("test uuid", () => {
    expect(safen.create("uuid").validate("A987FBC9-4BED-3078-CF07-9141BA07C9F3")).toBe(true)
    expect(safen.create("uuid").validate("xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3")).toBe(false)
  })
})

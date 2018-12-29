import "jest"
import { expectThrow } from "./utils"

import * as safen from "../src"

describe("safen.create", () => {
  it("success", () => {
    const v = safen.create("always_true")
    expect(v.validate("")).toBeTruthy()
  })

  it("fail", () => {
    const v = safen.create("always_false")
    expect(v.validate("")).toBeFalsy()
  })
})

describe("test target name", () => {

  it("test simple", () => {
    const v = safen.create("string")

    v.assert("string")

    expectThrow(() => v.assert(null), [{path: "", reason: "string", params: [], message: "It must be a string."}])
    expectThrow(() => v.assert(undefined), [{path: "", reason: "string", params: [], message: "It must be a string."}])
    expectThrow(() => v.assert([]), [{path: "", reason: "string", params: [], message: "It must be a string."}])
    expectThrow(() => v.assert({}), [{path: "", reason: "string", params: [], message: "It must be a string."}])
  })

  it("test multiple", () => {
    const v = safen.create("string & email")

    v.assert("corgidisco@gmail.com")

    expectThrow(() => v.assert("string"), [{path: "", reason: "email", params: [], message: "It must be a valid email address."}])
    expectThrow(() => v.assert(null), [{path: "", reason: "string", params: [], message: "It must be a string."}])
    expectThrow(() => v.assert(undefined), [{path: "", reason: "string", params: [], message: "It must be a string."}])
    expectThrow(() => v.assert([]), [{path: "", reason: "string", params: [], message: "It must be a string."}])
    expectThrow(() => v.assert({}), [{path: "", reason: "string", params: [], message: "It must be a string."}])
  })

  it("test normal", () => {
    const v = safen.create({users: "string"})

    v.assert({users: "user1"})

    expectThrow(() => v.assert({}), [{path: "users", reason: "required", params: [], message: "The users is required."}])
    expectThrow(() => v.assert({users: undefined}), [{path: "users", reason: "required", params: [], message: "The users is required."}])
    expectThrow(() => v.assert({users: null}), [{path: "users", reason: "string", params: [], message: "The users must be a string."}])

    expectThrow(() => v.assert({users: []}), [{path: "users", reason: "string", params: [], message: "The users must be a string."}])
    expectThrow(() => v.assert({users: ["user1"]}), [{path: "users", reason: "string", params: [], message: "The users must be a string."}])
  })

  it("test array", () => {
    const v = safen.create({"users[]": "string"})

    v.assert({users: []})
    v.assert({users: ["user1"]})

    expectThrow(() => v.assert({}), [{path: "users", reason: "required", params: [], message: "The users is required."}])
    expectThrow(() => v.assert({users: undefined}), [{path: "users", reason: "required", params: [], message: "The users is required."}])
    expectThrow(() => v.assert({users: null}), [{path: "users", reason: "array", params: [], message: "The users must be an array."}])
    expectThrow(() => v.assert({users: "user1"}), [{path: "users", reason: "array", params: [], message: "The users must be an array."}])
  })

  it("test options", () => {
    const v = safen.create({"users?": "string"})

    v.assert({})
    v.assert({users: undefined})

    expectThrow(() => v.assert({users: null}), [{path: "users", reason: "string", params: [], message: "The users must be a string."}])
    v.assert({users: "user1"})

    expectThrow(() => v.assert({users: []}), [{path: "users", reason: "string", params: [], message: "The users must be a string."}])
    expectThrow(() => v.assert({users: ["user1"]}), [{path: "users", reason: "string", params: [], message: "The users must be a string."}])
  })

  it("test array options", () => {
    const v = safen.create({"users[]?": "string"})

    v.assert({})
    v.assert({users: undefined})
    v.assert({users: []})
    v.assert({users: ["user1"]})

    expectThrow(() => v.assert({users: null}), [{path: "users", reason: "array", params: [], message: "The users must be an array."}])
    expectThrow(() => v.assert({users: "user1"}), [{path: "users", reason: "array", params: [], message: "The users must be an array."}])
  })

  it("test array length", () => {
    const v = safen.create({"users[2]": "string"})

    v.assert({users: ["1", "2"]})

    expectThrow(() => v.assert({users: []}), [{path: "users", reason: "array_length", params: [2], message: "The users's length must be 2."}])
    expectThrow(() => v.assert({users: ["1"]}), [{path: "users", reason: "array_length", params: [2], message: "The users's length must be 2."}])
    expectThrow(() => v.assert({users: ["1", "2", "3"]}), [{path: "users", reason: "array_length", params: [2], message: "The users's length must be 2."}])
  })

  it("test array length max", () => {
    const v = safen.create({"users[:2]": "string"})

    v.assert({users: []})
    v.assert({users: ["1"]})
    v.assert({users: ["1", "2"]})

    expectThrow(() => v.assert({users: ["1", "2", "3"]}), [{path: "users", reason: "array_length_max", params: [2], message: "The users's length may not be greater than 2."}])
  })

  it("test array length min", () => {
    const v = safen.create({"users[2:]": "string"})

    v.assert({users: ["1", "2"]})
    v.assert({users: ["1", "2", "3"]})

    expectThrow(() => v.assert({users: []}), [{path: "users", reason: "array_length_min", params: [2], message: "The users's length must be at least 2."}])
    expectThrow(() => v.assert({users: ["1"]}), [{path: "users", reason: "array_length_min", params: [2], message: "The users's length must be at least 2."}])
  })

  it("test array length between", () => {
    const v = safen.create({"users[1:2]": "string"})

    v.assert({users: ["1"]})
    v.assert({users: ["1", "2"]})

    expectThrow(() => v.assert({users: []}), [{path: "users", reason: "array_length_between", params: [1, 2], message: "The users's length must be between 1 and 2."}])
    expectThrow(() => v.assert({users: ["1", "2", "3"]}), [{path: "users", reason: "array_length_between", params: [1, 2], message: "The users's length must be between 1 and 2."}])
  })
})

describe("load all testers", () => {
  it("test after", () => {
    expect(safen.create("after:'2017-12-01 00:00:01'").validate("2017-12-01 00:00:00")).toBeFalsy()
    expect(safen.create("after:'2017-12-01 00:00:01'").validate("2017-12-01 00:00:01")).toBeFalsy()
    expect(safen.create("after:'2017-12-01 00:00:01'").validate("2017-12-01 00:00:02")).toBeTruthy()
    expect(safen.create("after:'2017-12-01 00:00:01'").validate("2017-12-01 00:00:03")).toBeTruthy()
  })

  it("test alpha", () => {
    expect(safen.create("alpha").validate("abcdefghijklmnopqrstuvwxyz")).toBeTruthy()
    expect(safen.create("alpha").validate("1")).toBeFalsy()
    expect(safen.create("alpha").validate("äbc")).toBeFalsy()
  })

  it("test alphanum", () => {
    expect(safen.create("alphanum").validate("abcdefghijklmnopqrstuvwxyz1")).toBeTruthy()
    expect(safen.create("alphanum").validate("1")).toBeTruthy()
    expect(safen.create("alphanum").validate("äbc1")).toBeFalsy()
  })

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

  it("test ascii", () => {
    expect(safen.create("ascii").validate("abcdefghijklmnopqrstuvwxyz")).toBeTruthy()
    expect(safen.create("ascii").validate("0123456789")).toBeTruthy()
    expect(safen.create("ascii").validate("!@#$%^&*()")).toBeTruthy()
    expect(safen.create("ascii").validate("äbc")).toBeFalsy()
    expect(safen.create("ascii").validate("ｆｏｏ")).toBeFalsy()
  })

  it("test base64", () => {
    expect(safen.create("base64").validate("Zg==")).toBeTruthy()
    expect(safen.create("base64").validate("Zg=")).toBeFalsy()
  })

  it("test before", () => {
    expect(safen.create("before:'2017-12-01 00:00:02'").validate("2017-12-01 00:00:00")).toBeTruthy()
    expect(safen.create("before:'2017-12-01 00:00:02'").validate("2017-12-01 00:00:01")).toBeTruthy()
    expect(safen.create("before:'2017-12-01 00:00:02'").validate("2017-12-01 00:00:02")).toBeFalsy()
    expect(safen.create("before:'2017-12-01 00:00:02'").validate("2017-12-01 00:00:03")).toBeFalsy()
  })

  it("test between", () => {
    expect(safen.create("between:2,3").validate(1)).toBeFalsy()
    expect(safen.create("between:2,3").validate(2)).toBeTruthy()
    expect(safen.create("between:2,3").validate(3)).toBeTruthy()
    expect(safen.create("between:2,3").validate(4)).toBeFalsy()

    expect(safen.create("between:2,3").validate(11)).toBeFalsy()
    expect(safen.create("between:2,3").validate(22)).toBeFalsy()
    expect(safen.create("between:2,3").validate(33)).toBeFalsy()

    expect(safen.create("between:'2','3'").validate("11")).toBeFalsy()
    expect(safen.create("between:'2','3'").validate("22")).toBeTruthy()
    expect(safen.create("between:'2','3'").validate("33")).toBeFalsy()
  })

  it("test boolean", () => {
    expect(safen.create("boolean").validate(true)).toBeTruthy()
    expect(safen.create("boolean").validate(false)).toBeTruthy()
    expect(safen.create("boolean").validate("true")).toBeFalsy()
    expect(safen.create("boolean").validate("false")).toBeFalsy()
    expect(safen.create("boolean").validate(1)).toBeFalsy()
    expect(safen.create("boolean").validate(0)).toBeFalsy()
  })

  it("test creditcard", () => {
    expect(safen.create("creditcard").validate("4716-2210-5188-5662")).toBeTruthy()
    expect(safen.create("creditcard").validate("4929 7226 5379 7141")).toBeTruthy()
    expect(safen.create("creditcard").validate("5398228707871528")).toBeFalsy()
  })

  it("test date", () => {
    expect(safen.create("date").validate("2018-12-25")).toBeTruthy()
    expect(safen.create("date").validate("12/25/2018")).toBeTruthy()
    expect(safen.create("date").validate("Dec 25, 2018")).toBeTruthy()
    expect(safen.create("date").validate(1539043200000)).toBeFalsy()
  })

  // it("test domain", () => {
  // })

  it("test email", () => {
    expect(safen.create("email").validate("corgidisco@gmail.com")).toBeTruthy()
    expect(safen.create("email").validate("corgidisco+en@gmail.com")).toBeTruthy()
    expect(safen.create("email").validate("corgi.disco@gmail.com")).toBeTruthy()
    expect(safen.create("email").validate("corgidisco")).toBeFalsy()
  })

  it("test finite", () => {
    expect(safen.create("finite").validate(100)).toBeTruthy()
    expect(safen.create("finite").validate(100.1)).toBeTruthy()
    expect(safen.create("finite").validate(NaN)).toBeFalsy()
    expect(safen.create("finite").validate(Infinity)).toBeFalsy()
  })

//   it("test hash", () => {
//     expect(safen.create("hash:md5").validate("d94f3f01")).toBeFalsy()
//     expect(safen.create("hash:md5").validate("d94f3f016ae679c3008de268209132f2")).toBeTruthy()
//     expect(safen.create("hash:crc32").validate("d94f3f016ae679c3008de268209132f2")).toBeFalsy()
//     expect(safen.create("hash:crc32").validate("d94f3f01")).toBeTruthy()
//   })

  it("test hexcolor", () => {
    expect(safen.create("hexcolor").validate("#CCCCCC")).toBeTruthy()
    expect(safen.create("hexcolor").validate("#ff")).toBeFalsy()
  })

  it("test in", () => {
    expect(safen.create("in:a,b,c").validate("a")).toBeTruthy()
    expect(safen.create("in:a,b,c").validate("d")).toBeFalsy()

    expect(safen.create("in:1,2,3").validate(1)).toBeTruthy()
    expect(safen.create("in:1,2,3").validate(4)).toBeFalsy()
    expect(safen.create("in:1,2,3").validate("1")).toBeFalsy()
    expect(safen.create("in:1,2,3").validate("4")).toBeFalsy()

    expect(safen.create("in:'1','2','3'").validate("1")).toBeTruthy()
    expect(safen.create("in:'1','2','3'").validate("4")).toBeFalsy()
    expect(safen.create("in:'1','2','3'").validate(1)).toBeFalsy()
    expect(safen.create("in:'1','2','3'").validate(4)).toBeFalsy()

    expect(safen.create("in:1.1,2.2,3.3").validate(1.1)).toBeTruthy()
    expect(safen.create("in:1.1,2.2,3.3").validate(4.4)).toBeFalsy()
  })

  it("test integer", () => {
    expect(safen.create("integer").validate(100)).toBeTruthy()
    expect(safen.create("integer").validate(100.1)).toBeFalsy()
  })

  it("test ip", () => {
    expect(safen.create("ip").validate("127.0.0.1")).toBeTruthy()
    expect(safen.create("ip").validate("2001:db8:0000:1:1:1:1:1")).toBeTruthy()
    expect(safen.create("ip").validate("256.0.0.0")).toBeFalsy()

    expect(safen.create("ip:v4").validate("127.0.0.1")).toBeTruthy()
    expect(safen.create("ip:v4").validate("256.0.0.0")).toBeFalsy()
    expect(safen.create("ip:v4").validate("2001:db8:0000:1:1:1:1:1")).toBeFalsy()

    expect(safen.create("ip:v6").validate("127.0.0.1")).toBeFalsy()
    expect(safen.create("ip:v6").validate("2001:db8:0000:1:1:1:1:1")).toBeTruthy()
  })

  it("test json", () => {
    expect(safen.create("json").validate("{}")).toBeTruthy()
    expect(safen.create("json").validate("asdf")).toBeFalsy()
  })

  // it("test jwt", () => {
  //   expect(safen.create("jwt").validate("{}")).toBeTruthy()
  //   expect(safen.create("jwt").validate("asdf")).toBeFalsy()
  // })

  it("test lowercase", () => {
    expect(safen.create("lowercase").validate("abcd")).toBeTruthy()
    expect(safen.create("lowercase").validate("abcD")).toBeFalsy()
  })

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

  it("test macaddress", () => {
    expect(safen.create("macaddress").validate("ab:ab:ab:ab:ab:ab")).toBeTruthy()
    expect(safen.create("macaddress").validate("01:02:03:04:05")).toBeFalsy()
  })

  it("test max", () => {
    expect(safen.create("max:3").validate(2)).toBeTruthy()
    expect(safen.create("max:3").validate(3)).toBeTruthy()
    expect(safen.create("max:3").validate(4)).toBeFalsy()

    expect(safen.create("max:3").validate(22)).toBeFalsy()
    expect(safen.create("max:3").validate(33)).toBeFalsy()
    expect(safen.create("max:'3'").validate("22")).toBeTruthy()
    expect(safen.create("max:'3'").validate("33")).toBeFalsy()
  })

  it("test min", () => {
    expect(safen.create("min:2").validate(1)).toBeFalsy()
    expect(safen.create("min:2").validate(2)).toBeTruthy()
    expect(safen.create("min:2").validate(3)).toBeTruthy()

    expect(safen.create("min:2").validate(11)).toBeTruthy()
    expect(safen.create("min:2").validate(22)).toBeTruthy()
    expect(safen.create("min:'2'").validate("11")).toBeFalsy()
    expect(safen.create("min:'2'").validate("22")).toBeTruthy()
  })

  it("test nan", () => {
    expect(safen.create("nan").validate(NaN)).toBeTruthy()
    expect(safen.create("nan").validate(Infinity)).toBeFalsy()
    expect(safen.create("nan").validate(1)).toBeFalsy()
  })

  it("test null", () => {
    expect(safen.create("null").validate(null)).toBeTruthy()
    expect(safen.create("null").validate(false)).toBeFalsy()
    expect(safen.create("null").validate("")).toBeFalsy()
  })

  it("test number", () => {
    expect(safen.create("number").validate(NaN)).toBeTruthy()
    expect(safen.create("number").validate(Infinity)).toBeTruthy()
    expect(safen.create("number").validate(1)).toBeTruthy()
    expect(safen.create("number").validate("abc")).toBeFalsy()
  })

  it("test port", () => {
    expect(safen.create("port").validate(0)).toBeTruthy()
    expect(safen.create("port").validate(1)).toBeTruthy()
    expect(safen.create("port").validate(65534)).toBeTruthy()
    expect(safen.create("port").validate(65535)).toBeTruthy()
    expect(safen.create("port").validate(65536)).toBeFalsy()
  })

  // it("test re", () => {
  // })

  it("test string", () => {
    expect(safen.create("string").validate("string")).toBeTruthy()
    expect(safen.create("string").validate(12345678)).toBeFalsy()
  })

  it("test symbol", () => {
    expect(safen.create("symbol").validate(Symbol("symbol"))).toBeTruthy()
    expect(safen.create("symbol").validate(12345678)).toBeFalsy()
  })

  // it("test timestamp", () => {
  // })

  // it("test timezone", () => {
  // })

  it("test uppercase", () => {
    expect(safen.create("uppercase").validate("ABCD")).toBeTruthy()
    expect(safen.create("uppercase").validate("abcD")).toBeFalsy()
  })

  it("test url", () => {
    expect(safen.create("url").validate("http://github.com/corgidisco")).toBeTruthy()
    expect(safen.create("url").validate("github.com")).toBeTruthy()
    expect(safen.create("url").validate("github")).toBeFalsy()
  })

  it("test uuid", () => {
    expect(safen.create("uuid").validate("A987FBC9-4BED-3078-CF07-9141BA07C9F3")).toBeTruthy()
    expect(safen.create("uuid").validate("xxxA987FBC9-4BED-3078-CF07-9141BA07C9F3")).toBeFalsy()
  })
})

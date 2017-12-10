
import {} from "jest"

import * as util from "../../dist/util"
import * as types from "../../dist/types"

describe("util.parse()", () => {
  const expects: Array<[string, [string, Array<string|null>, boolean]]> = [
    ["name", ["name", [], false]],
    ["name?", ["name", [], true]],
    ["name[]", ["name", [null], false]],
    ["name[]?", ["name", [null], true]],
    ["name[][][]", ["name", [null, null, null], false]],
    ["name[][][]?", ["name", [null, null, null], true]],
    ["name[10][20][30]", ["name", ["10", "20", "30"], false]],
    ["name[10][20][30]?", ["name", ["10", "20", "30"], true]],
    ["name[10][][30]?", ["name", ["10", null, "30"], true]],
  ]

  it("success", () => {
    expect.assertions(expects.length)
    for (const [input, output] of expects) {
      expect(util.parse(input)).toEqual(output)
    }
  })

  it("error", () => {
    try {
      util.parse(",foobar[][]?[]?")
    } catch (e) {
      expect(e.message).toEqual("Invalid target name. Did you mean this? 'foobar[][]?'.")
    }
  })
})

describe("util.normalize()", () => {
  const expects: Array<[types.NormalizableRule, types.NormalizedRule]> = [
    ["string", [["string"], []]],
    ["string | integer", [["string", "integer"], []]],
    [["string", "email"], [["string", "email"], []]],
    [() => "string", [["string"], []]],
    [() => () => ["string", "email"], [["string", "email"], []]],
    [
      {
        "username": "email",
        "password": "length_min:5 | length_max:20",
        "locations[]?": {
            "address": "string",
            "lat?": "float",
            "lng?": "float",
        },
      },
      [[], [
        [["username", [], false], [["email"], []]],
        [["password", [], false], [["length_min:5", "length_max:20"], []]],
        [["locations", [null], true], [[], [
          [["address", [], false], [["string"], []]],
          [["lat", [], true], [["float"], []]],
          [["lng", [], true], [["float"], []]],
        ]]],
      ]],
    ],
  ]

  it("success", () => {
    expect.assertions(expects.length)
    for (const [input, output] of expects) {
      expect(util.normalize(input)).toEqual(output)
    }
  })
})

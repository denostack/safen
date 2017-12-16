
import * as types from "../types"
import * as _ from "lodash"

const REASON_REGEX = /^([\w\.]+)\s*(?::\s*([\s\w,]*))?\s*(?:@\s*(\w+(?:(?:\.\w+)|(?:\[\d+\]))*))?$/u
const REASON_CORRECTION_REGEX = /([\w\.]+)\s*(?::\s*([\s\w,]*))?\s*(?:@\s*(\w+(?:(?:\.\w+)|(?:\[\d+\]))*))?/u

function reasonParse(reason: string): [string, string[], string] {
  if (!REASON_REGEX.test(reason)) {
    const correction = reason.match(REASON_CORRECTION_REGEX)
    throw new Error(`Invalid reason name. Did you mean this? '${(correction && correction[0]) || "unknown"}'.`)
  }
  const matches = reason.match(REASON_REGEX) as RegExpMatchArray
  return [
    matches[1],
    matches[2] ? (matches[2]).split(",").map(w => w.trim()).filter(w => w) : [],
    matches[3] ? matches[3] : "",
  ]
}

/**
 * @ref https://github.com/laravel/laravel/blob/master/resources/lang/en/validation.php
 */
export const defaultMessages: types.MessageMap = {
  // internal
  required: ["The :attribute is required.", "It is required."],
  array: ["The :attribute must be an array.", "It must be an array."],
  array_length: ["The :attribute's length must be :arg0.", "Its length must be :arg0."],
  array_length_between: ["The :attribute's length must be between :arg0 and :arg1.", "Its length must be between :arg0 and :arg1."],
  array_length_max: ["The :attribute's length may not be greater than :arg0.", "Its length may not be greater than :arg0."],
  array_length_min: ["The :attribute's length must be at least :arg0.", "Its length must be at least :arg0."],

  // validates
  after: ["The :attribute must be a date after :arg0.", "It must be a date after :arg0."],
  alpha: ["The :attribute may only contain letters.", "It may only contain letters."],
  alphanum: ["The :attribute may only contain letters and numbers.", "It may only contain letters and numbers."],
  always_false: "always_false is for debugging.",
  always_true: "always_true is for debugging.",
  ascii: ["The :attribute may only ascii characters.", "It may only ascii characters."],

  base64: ["The :attribute must be a base64 string.", "It must be a base64 string."],
  before: ["The :attribute must be a date before :arg0.", "It must be a date before :arg0."],
  between: ["The :attribute must be between :arg0 and :arg1.", "It must be between :arg0 and :arg1."],
  boolean: ["The :attribute must be true or false.", "It must be true or false."],
  boolean_string: ["The :attribute must be \"true\" or \"false\".", "It must be \"true or \"false."],
  buffer: ["The :attribute must be an buffer.", "It must be an buffer."],

  creditcard: ["The :attribute must be a valid credit card number.", "It must be a valid credit card number."],

  data_uri: ["The :attribute must be a valid data URI.", "It must be a valid data URI."],
  decimal_string: ["The :attribute must be a decimal string.", "It must be a decimal string."],
  domain: ["The :attribute must be a valid domain.", "It must be a valid domain."],

  email: ["The :attribute must be a valid email address.", "It must be a valid email address."],

  finite: ["The :attribute must be a finite.", "It must be a finite."],
  float: ["The :attribute must be a float.", "It must be a float."],

  hash: ["The :attribute must be a valid :arg0 hash.", "It must be a valid :arg0 hash."],
  hexcolor: ["The :attribute must be a valid hex color.", "It must be a valid hex color."],
  hexadecimal: ["The :attribute must be a valid hexa decimal string.", "It must be a valid hexa decimal string."],

  in: ["The :attribute does not exist in :args.", "It does not exist in :args."],
  int: ["The :attribute must be an integer.", "It must be an integer."],
  integer: ["The :attribute must be an integer.", "It must be an integer."],
  ip: ["The :attribute must be a valid IP:arg0 address.", "It must be a valid IP:arg0 address."],
  isbn: ["The :attribute must be a valid ISBN.", "It must be a valid ISBN."],
  issn: ["The :attribute must be a valid ISSN.", "It must be a valid ISSN."],
  isin: ["The :attribute must be a valid ISIN.", "It must be a valid ISIN."],
  isrc: ["The :attribute must be a valid ISRC.", "It must be a valid ISRC."],

  json: ["The :attribute must be a valid JSON string.", "It must be a valid JSON string."],

  lowercase: ["The :attribute may only lowercase characters.", "It may only lowercase characters."],

  length: ["The :attribute's length must be :arg0.", "Its length must be :arg0."],
  length_between: ["The :attribute's length must be between :arg0 and :arg1.", "Its length must be between :arg0 and :arg1."],
  length_max: ["The :attribute's length may not be greater than :arg0.", "Its length may not be greater than :arg0."],
  length_min: ["The :attribute's length must be at least :arg0.", "Its length must be at least :arg0."],

  macaddress: ["The :attribute must be a valid mac address.", "It must be a valid mac address."],
  map: ["The :attribute must be a map.", "It must be a map."],
  max: ["The :attribute may not be greater than :arg0.", "Its may not be greater than :arg0."],
  min: ["The :attribute must be at least :arg0.", "Its must be at least :arg0."],
  mobilephone: ["The :attribute must be a valid mobile phone.", "It must be a valid mobile phone."],
  mongoid: ["The :attribute must be a valid mongodb ID.", "It must be a valid mongodb ID."],

  nan: ["The :attribute must be a NaN.", "It must be a NaN."],
  number: ["The :attribute must be a number.", "It must be a number."],
  number_string: ["The :attribute must be a number string.", "It must be a number string."],

  object: ["The :attribute must be an object.", "It must be an object."],

  postalcode: ["The :attribute must be a valid postal code.", "It must be a valid postal code."],

  set: ["The :attribute must be a set.", "It must be a set."],
  string: ["The :attribute must be a string.", "It must be a string."],
  symbol: ["The :attribute must be a symbol.", "It must be a symbol."],

  uppercase: ["The :attribute may only UPPERCASE characters.", "It may only UPPERCASE characters."],
  url: ["The :attribute is not a valid URL.", "It is not a valid URL."],
  uuid: ["The :attribute must be a valid uuid.", "It must be a valid uuid."],
}

export class MapLoader implements types.MessageLoader {

  private messages: types.MessageMap

  public constructor(messages?: types.MessageMap) {
    this.messages = messages || Object.assign({}, defaultMessages)
  }

  public load(reason: string): string {
    const [tester, args, attribute] = reasonParse(reason)
    let messageTuple = (this.messages[tester] || ["An :tester error occured in :attribute.", "An :tester error occured."])
    if (!_.isArray(messageTuple)) {
      messageTuple = [messageTuple, messageTuple]
    }
    let message = attribute ? messageTuple[0] : messageTuple[1]
    message = message
      .replace(":attribute", attribute)
      .replace(":tester", tester)
      .replace(":args", args.join(", "))

    for (const i of args.keys()) {
      message = message.replace(`:arg${i}`, args[i])
    }
    return message
  }
}

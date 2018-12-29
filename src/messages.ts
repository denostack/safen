import { MessageMap } from "./interfaces/common"

// ref https://github.com/laravel/laravel/blob/master/resources/lang/en/validation.php

export const messages: MessageMap = {
  // internal
  required: ["The :path is required.", "It is required."],
  array: ["The :path must be an array.", "It must be an array."],
  array_length: ["The :path's length must be :param0.", "Its length must be :param0."],
  array_length_between: ["The :path's length must be between :param0 and :param1.", "Its length must be between :param0 and :param1."],
  array_length_max: ["The :path's length may not be greater than :param0.", "Its length may not be greater than :param0."],
  array_length_min: ["The :path's length must be at least :param0.", "Its length must be at least :param0."],

  // testers
  after: ["The :path must be a date after :param0.", "It must be a date after :param0."],
  alpha: ["The :path may only contain letters.", "It may only contain letters."],
  alphanum: ["The :path may only contain letters and numbers.", "It may only contain letters and numbers."],
  always_false: ["always_false is for debugging.", "always_false is for debugging."],
  always_true: ["always_true is for debugging.", "always_true is for debugging."],
  ascii: ["The :path may only ascii characters.", "It may only ascii characters."],

  base64: ["The :path must be a base64 string.", "It must be a base64 string."],
  before: ["The :path must be a date before :param0.", "It must be a date before :param0."],
  between: ["The :path must be between :param0 and :param1.", "It must be between :param0 and :param1."],
  boolean: ["The :path must be true or false.", "It must be true or false."],

  creditcard: ["The :path must be a valid credit card number.", "It must be a valid credit card number."],

  date: ["The :path must be a valid date string.", "It must be a valid date string."],
  domain: ["The :path must be a valid domain.", "It must be a valid domain."],

  email: ["The :path must be a valid email address.", "It must be a valid email address."],

  finite: ["The :path must be a finite.", "It must be a finite."],
  float: ["The :path must be a float.", "It must be a float."],

  hash: ["The :path must be a valid :param0 hash.", "It must be a valid :param0 hash."],
  hexcolor: ["The :path must be a valid hex color.", "It must be a valid hex color."],

  in: ["The :path does not exist in :params.", "It does not exist in :params."],
  int: ["The :path must be an integer.", "It must be an integer."],
  integer: ["The :path must be an integer.", "It must be an integer."],
  ip: ["The :path must be a valid IP(ver=:param0) address.", "It must be a valid IP address."],

  json: ["The :path must be a valid JSON string.", "It must be a valid JSON string."],
  jwt: ["The :path must be a valid JWT string.", "It must be a valid JWT string."],

  length: ["The :path's length must be :param0.", "Its length must be :param0."],
  length_between: ["The :path's length must be between :param0 and :param1.", "Its length must be between :param0 and :param1."],
  length_max: ["The :path's length may not be greater than :param0.", "Its length may not be greater than :param0."],
  length_min: ["The :path's length must be at least :param0.", "Its length must be at least :param0."],
  lowercase: ["The :path may only lowercase characters.", "It may only lowercase characters."],

  macaddress: ["The :path must be a valid mac address.", "It must be a valid mac address."],
  max: ["The :path may not be greater than :param0.", "Its may not be greater than :param0."],
  min: ["The :path must be at least :param0.", "Its must be at least :param0."],

  nan: ["The :path must be a NaN.", "It must be a NaN."],
  null: ["The :path must be a null.", "It must be a null."],
  number: ["The :path must be a number.", "It must be a number."],

  port: ["The :path must be a valid port(0-65535).", "It must be a valid port(0-65535)."],

  string: ["The :path must be a string.", "It must be a string."],
  symbol: ["The :path must be a symbol.", "It must be a symbol."],

  uppercase: ["The :path may only UPPERCASE characters.", "It may only UPPERCASE characters."],
  url: ["The :path is not a valid URL.", "It is not a valid URL."],
  uuid: ["The :path must be a valid uuid(ver=:param0).", "It must be a valid uuid(ver=:param0)."],
}

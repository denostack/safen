
import * as _ from "lodash"
import * as types from "../types"
import * as validator from "validator"

type GeneratorHandler = (value: any, ...options: any[]) => boolean
type GeneratorArgsMapper = (args: string[]) => any[]

function gen(handler: GeneratorHandler, mapper?: GeneratorArgsMapper): {new(): types.Tester} {
  if (!mapper) {
    mapper = (args: string[]): string[] => {
      return args
    }
  }

  class AnonymousTester implements types.Tester {

    private args: string[]

    public constructor(...args: string[]) {
      this.args = args
    }

    public test(data: any): boolean {
      if (!_.isString(data)) { // string only
        return false
      }
      return handler(data, ...(mapper as GeneratorArgsMapper)(this.args))
    }
  }
  return AnonymousTester
}

export const testers = {
  "validator.isAfter": gen(validator.isAfter),
  "validator.isAlpha": gen(validator.isAlpha),
  "validator.isAlphanumeric": gen(validator.isAlphanumeric),
  "validator.isAscii": gen(validator.isAscii),
  "validator.isBase64": gen(validator.isBase64),
  "validator.isBefore": gen(validator.isBefore),
  "validator.isBoolean": gen(validator.isBoolean),
  "validator.isByteLength": gen(validator.isByteLength),
  "validator.isCreditCard": gen(validator.isCreditCard),
  "validator.isCurrency": gen(validator.isCurrency), // has options
  "validator.isDataURI": gen(validator.isDataURI),
  "validator.isDecimal": gen(validator.isDecimal), // has options
  "validator.isDivisibleBy": gen(validator.isDivisibleBy),
  "validator.isEmail": gen(validator.isEmail), // has options
  "validator.isEmpty": gen(validator.isEmpty),
  "validator.isFQDN": gen(validator.isFQDN), // has options
  "validator.isFloat": gen(validator.isFloat), // has options
  "validator.isFullWidth": gen(validator.isFullWidth),
  "validator.isHalfWidth": gen(validator.isHalfWidth),
  "validator.isHash": gen((validator as any).isHash),
  "validator.isHexColor": gen(validator.isHexColor),
  "validator.isHexadecimal": gen(validator.isHexadecimal),
  "validator.isIP": gen(validator.isIP, (args: string[]) => {
    if (args.length) {
      if (args[0] === "v4") {
        return [4]
      }
      if (args[0] === "v6") {
        return [6]
      }
    }
    return args
  }),
  "validator.isISBN": gen(validator.isISBN, (args: string[]) => {
    if (args.length) {
      if (args[0] === "v10") {
        return [10]
      }
      if (args[0] === "v13") {
        return [13]
      }
    }
    return args
  }),
  "validator.isISSN": gen((validator as any).isISSN), // has options
  "validator.isISIN": gen(validator.isISIN),
  "validator.isISO8601": gen(validator.isISO8601),
  "validator.isISO31661Alpha2": gen((validator as any).isISO31661Alpha2),
  "validator.isISRC": gen((validator as any).isISRC),
  "validator.isIn": gen(validator.isIn),
  "validator.isInt": gen(validator.isInt), // has options
  "validator.isJSON": gen(validator.isJSON),
  "validator.isLatLong": gen((validator as any).isLatLong),
  "validator.isLength": gen(validator.isLength),
  "validator.isLowercase": gen(validator.isLowercase),
  "validator.isMACAddress": gen(validator.isMACAddress),
  "validator.isMD5": gen(validator.isMD5),
  "validator.isMobilePhone": gen(validator.isMobilePhone),
  "validator.isMongoId": gen(validator.isMongoId),
  "validator.isMultibyte": gen(validator.isMultibyte),
  "validator.isNumeric": gen(validator.isNumeric),
  "validator.isPort": gen((validator as any).isPort),
  "validator.isPostalCode": gen(validator.isPostalCode),
  "validator.isSurrogatePair": gen(validator.isSurrogatePair),
  "validator.isURL": gen(validator.isURL), // has options,
  "validator.isUUID": gen(validator.isUUID),
  "validator.isUppercase": gen(validator.isUppercase),
  "validator.isVariableWidth": gen(validator.isVariableWidth),
  "validator.isWhitelisted": gen(validator.isWhitelisted),
}

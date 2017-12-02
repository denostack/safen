
import * as types from "../types"
import {testerGenerator as gen} from "../util"
import * as validator from "validator"

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
  "validator.isFloat": gen(validator.isFloat), // has options, locale?
  "validator.isFullWidth": gen(validator.isFullWidth),
  "validator.isHalfWidth": gen(validator.isHalfWidth),
  "validator.isHash": gen((validator as any).isHash),
  "validator.isHexColor": gen(validator.isHexColor),
  "validator.isHexadecimal": gen(validator.isHexadecimal),
  "validator.isIP": gen(validator.isIP),
  "validator.isISBN": gen(validator.isISBN),
  "validator.isISSN": gen((validator as any).isISSN), // has options
  "validator.isISIN": gen(validator.isISIN),
  "validator.isISO8601": gen(validator.isISO8601),
  "validator.isISO31661Alpha2": gen((validator as any).isISO31661Alpha2),
  "validator.isISRC": gen((validator as any).isISRC),
  "validator.isIn": gen(validator.isIn),
  "validator.isInt": gen(validator.isInt), // prefer lodash.IntegerTester, has options
  "validator.isJSON": gen(validator.isJSON),
  "validator.isLatLong": gen((validator as any).isLatLong),
  "validator.isLength": gen(validator.isLength), // use default length tester
  "validator.isLowercase": gen(validator.isLowercase),
  "validator.isMACAddress": gen(validator.isMACAddress),
  "validator.isMD5": gen(validator.isMD5), // prefer validator.HashTester
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

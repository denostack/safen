import { Tester } from "../interfaces/common"


// ref. https://github.com/chriso/validator.js/blob/master/src/lib/isJWT.js
export const jwtTester: Tester = {
  template(value) {
    return `/^([A-Za-z0-9\\-_~+\\/]+[=]{0,2})\\.([A-Za-z0-9\\-_~+\\/]+[=]{0,2})(?:\\.([A-Za-z0-9\\-_~+\\/]+[=]{0,2}))?$/.test(${value})`
  },
}

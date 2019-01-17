import { Tester } from "../interfaces/common"

// ref. https://github.com/chriso/validator.js/blob/master/src/lib/isBase64.js
export const base64Tester: Tester = (value, params, gen) => {
  const len = gen()
  const fpc = gen()
  return `(function(){`
    + `var ${len}=${value}.length;`
    + `if(!${len}||${len}%4!==0|| /[^A-Z0-9+\\/=]/i.test(${value})){return false}`
    + `var ${fpc}=${value}.indexOf('=');`
    + `return ${fpc}===-1||${fpc}===${len}-1||(${fpc}===${len}-2&&${value}[${len}- 1]==='=')`
    + `})()`
}

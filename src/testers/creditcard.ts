import { Tester } from "../interfaces/common"
import { RE_CREDITCARD } from "../regexp"

// ref. https://github.com/chriso/validator.js/blob/master/src/lib/isCreditCard.js
export const creditcardTester: Tester = (value, params, gen) => {
  const sanitized = gen()
  const sum = gen()
  const digit = gen()
  const tmpNum = gen()
  const shouldDouble = gen()
  const i = gen()
  return `(function(){`
    + `var ${sanitized}=${value}.replace(/[- ]+/g,'');`
    + `if(!${RE_CREDITCARD}.test(${sanitized})){return false}`
    + `var ${sum}=0;var ${digit};var ${tmpNum};var ${shouldDouble};var ${i};`
    + `for(${i}=${sanitized}.length-1;${i}>=0;${i}--){`
    +   `${digit}=${sanitized}.substring(${i},(${i}+1));`
    +   `${tmpNum}=parseInt(${digit},10);`
    +   `if(${shouldDouble}){`
    +     `${tmpNum}*=2;`
    +     `if(${tmpNum}>=10){${sum}+=((${tmpNum}%10)+1)}`
    +     `else{${sum}+=${tmpNum}}`
    +   `}else{`
    +     `${sum}+=${tmpNum}`
    +   `}`
    +   `${shouldDouble}=!${shouldDouble}`
    + `}`
    + `return !!((${sum}%10)===0?${sanitized}:false)`
    + `})()`
}

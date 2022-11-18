import { SafenDecorator } from "../schema/schema.ts";

const RE_CREDITCARD =
  /^(?:4\d{12}(?:\d{3})?|5[1-5]\d{14}|(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)\d{12}|6(?:011|5\d\d)\d{12}|3[47]\d{13}|3(?:0[0-5]|[68]\d)\d{11}|(?:2131|1800|35\d{3})\d{11}|6[27]\d{14})$/;

export function creditcard(): SafenDecorator<string> {
  return {
    name: "creditcard",
    validate: (v) =>
      "(function(){" +
      `var san=${v}.replace(/[- ]+/g,'');` +
      `if(!${RE_CREDITCARD}.test(san)){return false}` +
      `var sum=0;var digit;var tmp;var check;var i;` +
      `for(i=san.length-1;i>=0;i--){` +
      `digit=san.substring(i,(i+1));` +
      `tmp=parseInt(digit,10);` +
      `if(check){` +
      `tmp*=2;` +
      `if(tmp>=10){sum+=((tmp%10)+1)}` +
      `else{sum+=tmp}` +
      "}else{" +
      `sum+=tmp` +
      "}" +
      `check=!check` +
      "}" +
      `return !!((sum%10)===0?san:false)` +
      "})()",
  };
}

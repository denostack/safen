import { Decorator } from "../decorator/decorator.ts";

const re =
  /^(?:4\d{12}(?:\d{3})?|5[1-5]\d{14}|(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)\d{12}|6(?:011|5\d\d)\d{12}|3[47]\d{13}|3(?:0[0-5]|[68]\d)\d{11}|(?:2131|1800|35\d{3})\d{11}|6[27]\d{14})$/;

const decorator: Decorator<string> = {
  name: "creditcard",
  validate(v) {
    v = v.replace(/\D+/g, "");
    if (!re.test(v)) return false;
    let sum = 0;
    let check = false;
    for (let i = v.length - 1; i >= 0; i--) {
      let tmp = parseInt(v.charAt(i), 10);
      if (check) {
        tmp *= 2;
        if (tmp >= 10) sum += (tmp % 10) + 1;
        else sum += tmp;
      } else {
        sum += tmp;
      }
      check = !check;
    }
    return !!((sum % 10) === 0 ? v : false);
  },
};

export function creditcard(): Decorator<string> {
  return decorator;
}

import { assertEquals } from "testing/asserts.ts";
import { parse } from "./parse.ts";
import { stringify } from "./stringify.ts";

{
  const testcases = [
    "string",
    "email",
    'email(true,false,null,"string",3.14,-500.5,/ab\\/c/gim)',
    "string|email|something",
    "string&email&something",
    "(string&email)|(string&phone)",
    "string&(email|string)&phone",
    "{}",
    "{name:string,username:(string&email)|null}",
    '{name?:string,username:(string&email&in("abc",10,20))|null}',
    "string[]",
    "string[1]",
    "string[1:]",
    "string[:2]",
    "string[1:2]",
    "string[][]",
    "string[][1]",
    "string[][1:]",
    "string[][:2]",
    "string[][1:2]",
    '{name?:string,username:(string&email&in("abc",10,20))|null}[1]|null',
    '({name?:string,username:(string&email&in("abc",10,20))|null}[1]|null)[][5]',
  ];

  for (const testcase of testcases) {
    Deno.test(`sfl/stringify, ${testcase}`, () => {
      assertEquals(stringify(parse(testcase)), testcase);
    });
  }
}

{
  const testcases: any = {
    "string": "string",
    "email": "email",
    'email(true,false,null,"string",3.14,-500.5,/ab\\/c/gim)':
      'email(true, false, null, "string", 3.14, -500.5, /ab\\/c/gim)',
    "string|email|something": "string | email | something",
    "string&email&something": "string & email & something",
    "(string&email)|(string&phone)": "(string & email) | (string & phone)",
    "string&(email|string)&phone": "string & (email | string) & phone",
    "{}": "{}",
    "{name:string,username:(string&email)|null}": `{
  name: string,
  username: (string & email) | null
}`,
    '{name?:string,username:(string&email&in("abc",10,20))|null}': `{
  name?: string,
  username: (string & email & in("abc", 10, 20)) | null
}`,
    "{name:string,username:string,address:{country:string,zipcode:string}}": `{
  name: string,
  username: string,
  address: {
    country: string,
    zipcode: string
  }
}`,
    "string[]": "string[]",
    "string[1]": "string[1]",
    "string[1:]": "string[1:]",
    "string[:2]": "string[:2]",
    "string[1:2]": "string[1:2]",
    "string[][]": "string[][]",
    "string[][1]": "string[][1]",
    "string[][1:]": "string[][1:]",
    "string[][:2]": "string[][:2]",
    "string[][1:2]": "string[][1:2]",
    '{name?:string,username:(string&email&in("abc",10,20))|null}[1]|null': `{
  name?: string,
  username: (string & email & in("abc", 10, 20)) | null
}[1] | null`,
    '({name?:string,username:(string&email&in("abc",10,20))|null}[1]|null)[][5]':
      `({
  name?: string,
  username: (string & email & in("abc", 10, 20)) | null
}[1] | null)[][5]`,
  };

  for (const input of Object.keys(testcases)) {
    Deno.test(`sfl/stringify, ${input}`, () => {
      assertEquals(stringify(parse(input), true), testcases[input]);
    });
  }
}

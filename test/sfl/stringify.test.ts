import "jest"

import { parse } from "../../src/sfl/parse"
import { stringify } from "../../src/sfl/stringify"


describe("stringify simple", () => {

  const testcases = [
    "string",
    "email",
    "email(true,false,null,\"string\",3.14,-500.5,/ab\\/c/gim)",
    "string|email|something",
    "string&email&something",
    "(string&email)|(string&phone)",
    "string&(email|string)&phone",
    "{}",
    "{name:string,username:(string&email)|null}",
    "{name?:string,username:(string&email&in(\"abc\",10,20))|null}",
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
    "{name?:string,username:(string&email&in(\"abc\",10,20))|null}[1]|null",
    "({name?:string,username:(string&email&in(\"abc\",10,20))|null}[1]|null)[][5]",
  ]

  for (const testcase of testcases) {
    it(`test ${testcase}`, () => {
      expect(stringify(parse(testcase))).toEqual(testcase)
    })  
  }
})

describe("stringify spacing", () => {

  const testcases: any = {
    "string": "string",
    "email": "email",
    "email(true,false,null,\"string\",3.14,-500.5,/ab\\/c/gim)": `email(true, false, null, \"string\", 3.14, -500.5, /ab\\/c/gim)`,
    "string|email|something": "string | email | something",
    "string&email&something": "string & email & something",
    "(string&email)|(string&phone)": "(string & email) | (string & phone)",
    "string&(email|string)&phone": "string & (email | string) & phone",
    "{}": "{}",
    "{name:string,username:(string&email)|null}": `{
  name: string,
  username: (string & email) | null
}`,
    "{name?:string,username:(string&email&in(\"abc\",10,20))|null}": `{
  name?: string,
  username: (string & email & in(\"abc\", 10, 20)) | null
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
    "{name?:string,username:(string&email&in(\"abc\",10,20))|null}[1]|null": `{
  name?: string,
  username: (string & email & in(\"abc\", 10, 20)) | null
}[1] | null`,
    "({name?:string,username:(string&email&in(\"abc\",10,20))|null}[1]|null)[][5]": `({
  name?: string,
  username: (string & email & in(\"abc\", 10, 20)) | null
}[1] | null)[][5]`,
  }

  for (const input of Object.keys(testcases)) {
    it(`test ${input}`, () => {
      expect(stringify(parse(input), true)).toEqual(testcases[input])
    })  
  }
})

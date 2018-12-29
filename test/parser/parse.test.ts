import "jest"

import { AstExpr, AstKey, AstTester } from "../../src/interfaces/ast"
import { parseExpr, parseKey } from "../../src/parser/parse"


describe("parse-key", () => {
  const successes: {[input: string]: AstKey} = {
    "name": {n: "name", l: [], o: false},
    "name?": {n: "name", l: [], o: true},
    "name[]": {n: "name", l: [null], o: false},
    "name[]?": {n: "name", l: [null], o: true},
    "name[][][]": {n: "name", l: [null, null, null], o: false},
    "name[][][]?": {n: "name", l: [null, null, null], o: true},
    "name[10][20][30]": {n: "name", l: ["10", "20", "30"], o: false},
    "name[10][10:20][30]": {n: "name", l: ["10", ["10", "20"], "30"], o: false},
    "name[10][20][30]?": {n: "name", l: ["10", "20", "30"], o: true},
    "name[10][][30]?": {n: "name", l: ["10", null, "30"], o: true},
  }

  for (const input of Object.keys(successes)) {
    it(`success: ${input}`, () => {
        expect(parseKey(input)).toEqual(successes[input])
    })
  }

  const fails: {[input: string]: string} = {
    ",foobar[][]?[]?": "foobar[][]?",
  }
  for (const input of Object.keys(fails)) {
    it(`fail: ${input}`, () => {
      try {
        parseKey(input)
        fail()
      } catch (e) {
        expect(e.correction).toEqual(fails[input])
      }
    })
  }
})


describe("parse-expr", () => {
  const successes: {[input: string]: AstExpr | AstTester} = {
    "string": {t: 4, n: "string", p: []},
    "  string  ": {t: 4, n: "string", p: []},
    "  (  string  )  ": {t: 4, n: "string", p: []},
    "between:10,20": {t: 4, n: "between", p: [10, 20]},
    "  between  :  10  ,  20  ": {t: 4, n: "between", p: [10, 20]},
    "  (  between  :  10  ,  20  )  ": {t: 4, n: "between", p: [10, 20]},
    "between:,20": {t: 4, n: "between", p: [null, 20]},
    "any:,null,true,false,100,-100,1.101,-10.101,abc,\"hello \\\"world\\\"!\",'hello \\\'world\\\'!\',": {t: 4, n: "any", p: [
      null, null, true, false, 100, -100, 1.101, -10.101, "abc", "hello \"world\"!", "hello 'world'!", null,
    ]},
    "any : , null , true , false , 100 , -100 , 1.101 , -10.101 , abc , \"hello \\\"world\\\"!\" , 'hello \\\'world\\\'!\' , ": {t: 4, n: "any", p: [
      null, null, true, false, 100, -100, 1.101, -10.101, "abc", "hello \"world\"!", "hello 'world'!", null,
    ]},
    "string & between:10,20": {t: 2, n: "and", p: [
      {t: 4, n: "string", p: []},
      {t: 4, n: "between", p: [10, 20]},
    ]},
    "string & email & between:10,20": {t: 2, n: "and", p: [
      {t: 4, n: "string", p: []},
      {t: 4, n: "email", p: []},
      {t: 4, n: "between", p: [10, 20]},
    ]},
    "  string  &  email  &  between  :  10  ,  20  ": {t: 2, n: "and", p: [
      {t: 4, n: "string", p: []},
      {t: 4, n: "email", p: []},
      {t: 4, n: "between", p: [10, 20]},
    ]},
    "string | between:10,20": {t: 2, n: "or", p: [
      {t: 4, n: "string", p: []},
      {t: 4, n: "between", p: [10, 20]},
    ]},
    "string | email | between:10,20": {t: 2, n: "or", p: [
      {t: 4, n: "string", p: []},
      {t: 4, n: "email", p: []},
      {t: 4, n: "between", p: [10, 20]},
    ]},
    "  string  |  email  |  between  :  10  ,  20  ": {t: 2, n: "or", p: [
      {t: 4, n: "string", p: []},
      {t: 4, n: "email", p: []},
      {t: 4, n: "between", p: [10, 20]},
    ]},
    "string & email | string & phone": {t: 2, n: "or", p: [
      {t: 2, n: "and", p: [
        {t: 4, n: "string", p: []},
        {t: 4, n: "email", p: []},
      ]},
      {t: 2, n: "and", p: [
        {t: 4, n: "string", p: []},
        {t: 4, n: "phone", p: []},
      ]},
    ]},
    "  string  &  email  |  string  &  phone  ": {t: 2, n: "or", p: [
      {t: 2, n: "and", p: [
        {t: 4, n: "string", p: []},
        {t: 4, n: "email", p: []},
      ]},
      {t: 2, n: "and", p: [
        {t: 4, n: "string", p: []},
        {t: 4, n: "phone", p: []},
      ]},
    ]},
    "string | string & email | phone": {t: 2, n: "or", p: [
      {t: 4, n: "string", p: []},
      {t: 2, n: "and", p: [
        {t: 4, n: "string", p: []},
        {t: 4, n: "email", p: []},
      ]},
      {t: 4, n: "phone", p: []},
    ]},
    "(string | email) & (string | phone)": {t: 2, n: "and", p: [
      {t: 2, n: "or", p: [
        {t: 4, n: "string", p: []},
        {t: 4, n: "email", p: []},
      ]},
      {t: 2, n: "or", p: [
        {t: 4, n: "string", p: []},
        {t: 4, n: "phone", p: []},
      ]},
    ]},
    "  (  string  |  email  )  &  (  string  |  phone  )  ": {t: 2, n: "and", p: [
      {t: 2, n: "or", p: [
        {t: 4, n: "string", p: []},
        {t: 4, n: "email", p: []},
      ]},
      {t: 2, n: "or", p: [
        {t: 4, n: "string", p: []},
        {t: 4, n: "phone", p: []},
      ]},
    ]},
  }

  for (const input of Object.keys(successes)) {
    it(`success: ${input}`, () => {
      expect(parseExpr(input)).toEqual(successes[input])
    })
  }

  const fails: {[input: string]: string} = {
    "between:1 2": "2",
    "(between:1": "",
  }

  for (const input of Object.keys(fails)) {
    it(`fail: ${input}`, () => {
      try {
        parseExpr(input)
        fail()
      } catch (e) {
        expect(e.remain).toEqual(fails[input])
      }
    })
  }
})

import { SyntaxError } from "../errors/syntax-error"
import {
  SflObjectProperty,
  SflObjectTester,
  SflScalarTester,
  SflTester
} from "../interfaces/sfl"

const RE_WHITESPACE = /^[ \t\r\v\f]+/
const RE_NEWLINE = /^[\n]+/

const RE_TESTERNAME = /^([a-zA-Z_][a-zA-Z0-9_]*)/
const RE_TESTERPARAM = /^(null|true|false)|("(?:[^"\\]*|\\")*")|('(?:[^'\\]*|\\')*')|(-?[0-9]+(?:\.[0-9]*)?)|\/((?:[^\/\\]*|\\\/)+)\/(igm|img|gim|gmi|mig|mgi|ig|im|gi|gm|mi|mg|i|g|m)?/

const RE_OBJECTKEY = /^([a-zA-Z_][a-zA-Z0-9_]*)(\?)?/
const RE_NUMBER = /^(\d+)/

/*
SFL Grammar

@ref http://hepunx.rl.ac.uk/~adye/jsspec11/llr.htm

root: expr
expr: orexpr
orexpr: andexpr
  | andexpr '|' orexpr

andexpr: memberexpr
  | memberexpr '&' andexpr

memberexpr: unaryexpr
  | memberexpr '[' ']'
  | memberexpr '[' RE_NUMBER ']'
  | memberexpr '[' RE_NUMBER ':' ']'
  | memberexpr '[' ':' RE_NUMBER ']'
  | memberexpr '[' RE_NUMBER ':' RE_NUMBER ']'

unaryexpr: tester
  | '(' expr ')'

tester: object
  | scalar

object: '{' '}'
  | '{' objectpairs '}'

objectpairs: objectpair
  | objectpairs ',' objectpair

objectpair: objectkey ':' expr
objectkey: RE_OBJECTKEY

scalar: testername
  | testername '(' ')'
  | testername '(' testerparams ')'

testername: RE_TESTERNAME

testerparams: testerparam
  | testerparams ',' testerparam

testerparam: RE_TESTPARAM

 */

let origin: string
let buf: string
let pos: number
let ln: number
let col: number
let match: RegExpMatchArray | null
let len: number

function white() {
  while (1) {
    match = buf.match(RE_WHITESPACE)
    if (!match) {
      match = buf.match(RE_NEWLINE)
      if (!match) {
        return
      } else {
        len = match[0].length
        pos += len
        ln += len
        col = 1
        buf = buf.slice(len)
      }
    } else {
      len = match[0].length
      pos += len
      col += len
      buf = buf.slice(len)
    }
  }
}

function next(cnt = 1) {
  pos += cnt
  col += cnt
  buf = buf.slice(cnt)
  white()
}


function root(): SflTester {
  return expr()
}

function expr(): SflTester {
  white()
  return orexpr()
}

function orexpr(): SflTester {
  const params = [andexpr()]
  white()
  while (buf[0] === "|") {
    next()
    params.push(andexpr())
    white()
  }
  if (params.length === 1) {
    return params[0]
  }
  return {
    type: "or",
    params,
  }
}

function andexpr(): SflTester {
  const params = [memberexpr()]
  white()
  while (buf[0] === "&") {
    next()
    params.push(memberexpr())
    white()
  }
  if (params.length === 1) {
    return params[0]
  }
  return {
    type: "and",
    params,
  }
}

function memberexpr(): SflTester {
  let nxt = unaryexpr()
  white()
  while (buf[0] === "[") {
    next()
    let min: number | undefined
    let max: number | undefined
    if (buf[0] === ":") {
      next()
      match = buf.match(RE_NUMBER)
      if (match) {
        max = +match[0]
        next(match[0].length)
      }
    } else {
      match = buf.match(RE_NUMBER)
      if (match) {
        min = +match[0]
        next(match[0].length)
        if (buf[0] === ":") {
          next()
          match = buf.match(RE_NUMBER)
          if (match) {
            max = +match[0]
            next(match[0].length)
          }
        } else {
          max = min
        }
      }
    }
    white()
    if (buf[0] === "]") {
      next()
      const hasMin = typeof min !== "undefined"
      const hasMax = typeof max !== "undefined"
      nxt = hasMin && hasMax ? {type: "array", min, max, value: nxt} :
        hasMax ? {type: "array", max, value: nxt} :
        hasMin ? {type: "array", min, value: nxt} :
        /* else */ {type: "array", value: nxt}

    } else {
      throw error("\"]\"")
    }
  }
  return nxt
}

function unaryexpr(): SflTester {
  if (buf[0] === "(") {
    next()
    const nxt = expr()
    white()
    if (buf[0] === ")") {
      pos += 1
      col += 1
      buf = buf.slice(1)
      return nxt
    }
    throw error("\")\"")
  }
  return tester()
}

function tester(): SflTester {
  return buf[0] === "{" ? object() : scalar()
}

function object(): SflObjectTester {
  next()
  if (buf[0] === "}") {
    next()
    return {
      type: "object",
      properties: {},
    }
  }
  match = buf.match(RE_OBJECTKEY)
  const properties: {[key: string]: SflObjectProperty} = {}
  while (match) {
    const key = match[1]
    const optional = !!(match[2])
    next(match[0].length)
    white()
    if (buf[0] !== ":") {
      throw error("\":\"")
    }
    next()
    properties[key] = {
      optional,
      value: expr(),
    }
    white()
    switch (buf[0]) {
      case ",":
        next()
        if (buf[0] === "}") {
          next()
          return {
            type: "object",
            properties,
          }
        }
        match = buf.match(RE_OBJECTKEY)
        continue
      case "}":
        next()
        return {
          type: "object",
          properties,
        }
    }
    break
  }
  throw error("\"}\"")
}

function scalar(): SflScalarTester {
  match = buf.match(RE_TESTERNAME)
  if (match) {
    const name = match[0]
    const params: any[] = []
    next(name.length)
    if (buf[0] === "(") {
      next()
      if (buf[0] === ")") {
        next()
        return {
          type: "scalar",
          name,
          params,
        }
      }
      match = buf.match(RE_TESTERPARAM)
      while (match) {
        if (match[1]) {
          switch (match[1]) {
            case "null":
              params.push(null)
              break
            case "true":
              params.push(true)
              break
            case "false":
              params.push(false)
              break
          }
        } else if (match[2]) {
          params.push(match[2].replace(/^"|"$/g, "").replace(/\\\"/g, "\""))
        } else if (match[3]) {
          params.push(match[3].replace(/^'|'$/g, "").replace(/\\'/g, "'"))
        } else if (match[4]) {
          params.push(+match[4])
        } else if (match[5]) {
          params.push(new RegExp(match[5].replace(/\\\//g, "/"), match[6] || undefined))
        } else {
          throw error("tester param")
        }
        next(match[0].length)
        switch (buf[0]) {
          case ",":
            next()
            if (buf[0] === ")") {
              next()
              return {
                type: "scalar",
                name,
                params,
              }
            }
            match = buf.match(RE_TESTERPARAM)
            continue
          case ")":
            next()
            return {
              type: "scalar",
              name,
              params,
            }
        }
      }
    }
    return {
      type: "scalar",
      name,
      params,
    }
  } else {
    throw error("tester")
  }
}

function error(expected = "") {
  return new SyntaxError(origin, expected, buf[0], pos, ln, col)
}


export function parse(ctx: string): SflTester {
  origin = buf = ctx
  pos = 0
  ln = 1
  col = 1

  const result = root()
  white()

  if (buf.length) {
    throw error("EOF")
  }
  return result
}

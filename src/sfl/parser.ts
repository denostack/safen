import {
  SflObjectProperty,
  SflObjectTester,
  SflScalarTester,
  SflTester
  } from "../interfaces/sfl"

const RE_WHITESPACE = /^[ \t\r\v\f]+/
const RE_NEWLINE = /^[\n]+/

const RE_TESTERNAME = /^([a-zA-Z_][a-zA-Z0-9_]*)/
const RE_TESTERPARAM = /^(?:(null|true|false)|("(?:[^"\\]*|\\")*")|('(?:[^'\\]*|\\')*')|(-?[0-9]+(?:\.[0-9]*)?))/

const RE_OBJECTKEY = /^([a-zA-Z_][a-zA-Z0-9_]*)(\?)?/u

/*
root: expr
expr: tester
  | '(' expr ')'
  | expr '&' expr
  | expr '|' expr

tester: object
  | scalar
  | tester '[' ']'
  | tester '[' NUMBER ']'
  | tester '[' NUMBER ':' ']'
  | tester '[' ':' NUMBER ']'
  | tester '[' NUMBER ':' NUMBER ']'

object: '{' '}'
  | '{' objectpairs '}'

objectpairs: objectpair
  | objectpairs '\n' objectpair

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

function expr(): SflTester {
  white()
  const orParams: SflTester[] = []
  let andParams: SflTester[] = [buf[0] === "(" ? brace() : tester()]
  while (1) {
    white()
    if (buf[0] === "&") {
      next()
      const nextTester = buf[0] === "(" ? brace() : tester()

      if (nextTester.type === "and") {
        andParams = andParams.concat(nextTester.params)
      } else {
        andParams.push(nextTester)
      }
    } else if (buf[0] === "|") {
      next()
      const nextTester = buf[0] === "(" ? brace() : tester()

      if (andParams.length === 1) {
        orParams.push(andParams[0])
      } else {
        orParams.push({
          type: "and",
          params: andParams,
        })
      }
      if (nextTester.type === "or") {
        andParams = [...nextTester.params]
      } else {
        andParams = [nextTester]
      }
    } else {
      break
    }
  }
  if (andParams.length === 1) {
    orParams.push(andParams[0])
  } else {
    orParams.push({
      type: "and",
      params: andParams,
    })
  }
  if (orParams.length === 1) {
    return orParams[0]
  }
  return {
    type: "or",
    params: orParams,
  }
}

function brace(): SflTester {
  next()
  const nextTester = expr()
  white()
  if (buf[0] === ")") {
    pos += 1
    col += 1
    buf = buf.slice(1)
    return nextTester
  }
  throw error()
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
      throw error()
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
  throw error()
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
        } else {
          throw error
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
    throw error()
  }
}

function tester(): SflTester {
  white()
  switch (buf[0]) {
    case "{":
      return object()
  }
  return scalar()
}

function root(): SflTester {
  return expr()
}

function error(point = "") {
  // Error Example
  // something wrong (1:7)
  // 1: email || null
  //           ^
  const lines = origin.split("\n")
  return Object.assign(new Error(`Syntax Error: unexpected token${point} "${buf[0]}" (${ln}:${col})
${ln}: ${lines[ln - 1]}
${"^".padStart(col + 2 + ln.toString().length, " ")}`), {
    code: "SYNTAX_ERROR",
    position: pos,
    line: ln,
    column: col,
  })
}


export function parse(ctx: string): SflTester {
  origin = buf = ctx
  pos = 0
  ln = 1
  col = 1

  const result = root()
  white()

  if (buf.length) {
    throw error()
  }
  return result
}

import { InvalidKeyError } from "../errors/invalid-key-error"
import {
  AstExpr,
  AstKey,
  AstObject,
  AstTester,
  AstValue
  } from "../interfaces/ast"
import { Scalar } from "../interfaces/common"


const RE_BLANK = /^\s+/
const RE_TESTER_NAME = /^(\w+)/
const RE_TESTER_PARAM = /^(?:([a-zA-Z_][a-zA-Z0-9_-]*)|("(?:[^"\\]*|\\")*")|('(?:[^'\\]*|\\')*')|(-?[0-9]+(?:\.[0-9]*)?))/

const RE_KEY = /^([a-zA-Z_][a-zA-Z0-9_-]+)((?:\[\d*:?\d*\])*)(\?)?$/u

const RE_CORRECTION_KEY = /([a-zA-Z_][a-zA-Z0-9_-]+)((?:\[\d*:?\d*\])*)(\?)/u

export function parse(rule: any): AstValue {
  while (typeof rule === "function") {
    rule = rule()
  }
  if (typeof rule === "string") {
    return parseExpr(rule)
  }
  const ret: AstObject = {
    t: 1,
    p: [],
  }
  for (const key of Object.keys(rule)) {
    const normKey = parseKey(key)
    let nextRule = rule[key]
    while (typeof nextRule === "function") {
      nextRule = nextRule()
    }
    ret.p.push({k: normKey, v: parse(nextRule)})
  }
  return ret
}


export function parseKey(key: string): AstKey {
  const matches = key.match(RE_KEY)
  if (!matches) {
    const cMatches = key.match(RE_CORRECTION_KEY)
    const correction = cMatches && cMatches[0]
    if (correction) {
      throw new InvalidKeyError(`Invalid key. Did you mean this? '${correction}'.`, key, correction)
    } else {
      throw new InvalidKeyError(`Invalid key.`, key)
    }
  }

  let iterators: Array<[string|null, string|null]|string|null> = []
  if (matches[2]) {
    iterators = matches[2]
      .slice(1, -1)
      .split("][")
      .map(chunk => chunk === ""
        ? null
        : chunk.indexOf(":") > -1
        ? chunk.split(":").map(c => c || null) as [string|null, string|null]
        : chunk)
  }
  return {
    n: matches[1],
    l: iterators,
    o: !!(matches[3]),
  }
}

export function parseExpr(expression: string): AstExpr | AstTester {
  let buf = expression
  let match: RegExpMatchArray | null = null

  const next = (text: string) => {
    buf = buf.replace(text, "")
  }

  const white = () => {
    match = buf.match(RE_BLANK)
    if (match) {
      next(match[0])
    }
  }

  const tester: () => AstTester = () => {
    white()
    match = buf.match(RE_TESTER_NAME)
    if (match) {
      next(match[0])
      const n = match[0]
      const p = [] as Scalar[]
      white()
      if (buf[0] === ":") {
        next(":")
        while (1) {
          white()
          match = buf.match(RE_TESTER_PARAM)
          if (match) {
            if (match[1]) {
              switch (match[1]) {
                case "null":
                  p.push(null)
                  break
                case "true":
                  p.push(true)
                  break
                case "false":
                  p.push(false)
                  break
                default:
                  p.push(match[1])
              }
            } else if (match[2]) {
              p.push(match[2].replace(/^"|"$/g, "").replace(/\\\"/g, "\""))
            } else if (match[3]) {
              p.push(match[3].replace(/^'|'$/g, "").replace(/\\'/g, "'"))
            } else if (match[4]) {
              p.push(+match[4])
            } else {
              throw Object.assign(new Error(`syntax error: remain "${buf}"`), {remain: buf})
            }
            next(match[0])
          } else {
            p.push(null)
          }
          white()
          if (buf[0] === ",") {
            next(",")
          } else {
            break
          }
        }
      }
      return {t: 4, n, p}
    } else {
      throw Object.assign(new Error(`syntax error: remain "${buf}"`), {remain: buf})
    }
  }

  const stmt: () => AstTester | AstExpr = () => {
    white()
    if (buf[0] === "(") {
      next("(")
      const ret = expr()
      white()
      if (buf[0] === ")") {
        next(")")
        return ret
      }
      throw Object.assign(new Error(`syntax error: remain "${buf}"`), {remain: buf})
    } else {
      return tester()
    }
  }

  const expr: () => AstTester | AstExpr = () => {
    const p: Array<AstExpr | AstTester> = []
    let subP: Array<AstExpr | AstTester> = [stmt()]
    while (1) {
      white()
      if (buf[0] === "&") {
        next("&")
        subP.push(stmt())
      } else if (buf[0] === "|") {
        next("|")
        if (subP.length === 1) {
          p.push(subP[0])
        } else {
          p.push({
            t: 2,
            n: "and",
            p: subP,
          })
        }
        subP = [stmt()]
      } else {
        break
      }
    }
    if (subP.length === 1) {
      p.push(subP[0])
    } else {
      p.push({
        t: 2,
        n: "and",
        p: subP,
      })
    }
    if (p.length === 1) {
      return p[0]
    }
    return {
      t: 2,
      n: "or",
      p,
    }
  }

  const result = expr()
  white()
  if (buf.length) {
    throw Object.assign(new Error(`syntax error: remain "${buf}"`), {remain: buf})
  }
  return result
}

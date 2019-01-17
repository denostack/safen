import { AstExpr, AstTester, AstValue } from "../interfaces/ast"
import { Scalar, TesterMap } from "../interfaces/common"


export function generateValidate(rule: AstValue, testers: TesterMap = {}): (value: any) => boolean {
  let u = 0
  const uid = () => `t${u++}`

  function astvalue(curr: AstValue, val: string): string {
    switch (curr.t) {
      case 1:
        let nextFunc = ""
        for (const {k, v} of curr.p) {
          const nextVal = `${val}.${k.n}`
          if (k.o) { // optional start
            nextFunc += `if (typeof ${nextVal} !== "undefined") {\n`
          } else {
            nextFunc += `if (typeof ${nextVal} === "undefined") { return false }\n`
          }
          if (k.l.length) {
            nextFunc += astarrvalue(v, k.l, nextVal)
          } else {
            nextFunc += astvalue(v, nextVal)
          }
          if (k.o) { // optional end
            nextFunc += `}\n`
          }
        }
        return nextFunc
      case 2:
      case 4:
        return `if (!(${astcondition(curr, val)})) { return false }\n`
    }
  }

  function astcondition(curr: AstExpr | AstTester, val: string): string {
    switch (curr.t) {
      case 2:
        return `(${(curr.p).map(p => astcondition(p, val)).join(curr.n === "and" ? "&&" : "||")})`
      case 4:
        return testers[curr.n](val, curr.p as string[], uid)
    }
  }

  function astarrvalue(curr: AstValue, params: Array<[string|null, string|null]|string|null>, val: string): string {
    let nextFunc = ""
    params = params.slice()
    const a = params.pop()!
    if (a === null) {
      nextFunc += `if (!Array.isArray(${val})) { return false }\n`
    } else if (typeof a === "string") {
      nextFunc += `if (!Array.isArray(${val}) || ${val}.length !== ${a}) { return false }\n`
    } else if (a[0] !== null && a[1] !== null) {
      nextFunc += `if (!Array.isArray(${val}) || ${val}.length < ${a[0]} || ${val}.length > ${a[1]}) { return false }\n`
    } else if (a[0] !== null) {
      nextFunc += `if (!Array.isArray(${val}) || ${val}.length < ${a[0]}) { return false }\n`
    } else if (a[1] !== null) {
      nextFunc += `if (!Array.isArray(${val}) || ${val}.length > ${a[1]}) { return false }\n`
    }

    const i = uid()
    nextFunc += `var ${i};for (${i}=0;${i}<${val}.length;${i}++) {\n`
    if (params.length) {
      nextFunc += astarrvalue(curr, params, `${val}[${i}]`)
    } else {
      nextFunc += astvalue(curr, `${val}[${i}]`)
    }
    nextFunc += "}\n"
    return nextFunc
  }

  const func = `${astvalue(rule, "v")}return true`
  return new Function("v", func) as (value: any) => boolean // tslint:disable-line function-constructor
}

export function generateAssert(rule: AstValue, testers: TesterMap = {}): (value: any) => {[path: string]: Array<[string, Scalar[]]>} {
  let u = 0
  const uid = () => `t${u++}`

  function astvalue(curr: AstValue, val: string): string {
    switch (curr.t) {
      case 1:
        let nextFunc = ""
        for (const {k, v} of curr.p) {
          const nextVal = `${val}.${k.n}`
          nextFunc += `path.push("${k.n.replace("\"", "\\\"")}")\n`
          if (k.o) { // optional start
            nextFunc += `if (typeof ${nextVal} !== "undefined") {\n`
          } else {
            nextFunc += `if (typeof ${nextVal} === "undefined") {p=path.join(".");err[p]=err[p]||[];err[p].push(["required", []])} else {\n`
          }
          if (k.l.length) {
            nextFunc += astarrvalue(v, k.l, nextVal)
          } else {
            nextFunc += astvalue(v, nextVal)
          }
          // optional end
          nextFunc += `}\n`
          nextFunc += `path.pop()\n`
        }
        return nextFunc
      case 2:
      case 4:
        return `if (${astcondition(curr, val)}) {delete err[path.join(".")]}\n`
    }
  }

  function astcondition(curr: AstExpr | AstTester, val: string): string {
    switch (curr.t) {
      case 2:
        return `(${(curr.p).map(p => astcondition(p, val)).join(curr.n === "and" ? "&&" : "||")})`
      case 4:
        return `(function(){var r=${testers[curr.n](val, curr.p, uid)};if(!r){p=path.join(".");err[p]=err[p]||[];err[p].push(["${curr.n}", ${JSON.stringify(curr.p)}])};return r})()`
    }
  }

  function astarrvalue(curr: AstValue, params: Array<[string|null, string|null]|string|null>, val: string): string {
    let nextFunc = ""
    params = params.slice()
    const a = params.pop()!
    let ifcount = 0
    if (a === null) {
      nextFunc += `if (!Array.isArray(${val})) {p=path.join(".");err[p]=err[p]||[];err[p].push(["array", []])} else {\n`
      ifcount++
    } else if (typeof a === "string") {
      nextFunc += `if (!Array.isArray(${val})) {p=path.join(".");err[p]=err[p]||[];err[p].push(["array", []])} else {\n`
      nextFunc += `if (${val}.length !== ${a}) {p=path.join(".");err[p]=err[p]||[];err[p].push(["array_length", [${a}]])} else {\n`
      ifcount += 2
    } else if (a[0] !== null && a[1] !== null) {
      nextFunc += `if (!Array.isArray(${val})) {p=path.join(".");err[p]=err[p]||[];err[p].push(["array", []])} else {\n`
      nextFunc += `if (${val}.length < ${a[0]} || ${val}.length > ${a[1]}) {p=path.join(".");err[p]=err[p]||[];err[p].push(["array_length_between", [${a[0]}, ${a[1]}]])} else {\n`
      ifcount += 2
    } else if (a[0] !== null) {
      nextFunc += `if (!Array.isArray(${val})) {p=path.join(".");err[p]=err[p]||[];err[p].push(["array", []])} else {\n`
      nextFunc += `if (${val}.length < ${a[0]}) {p=path.join(".");err[p]=err[p]||[];err[p].push(["array_length_min", [${a[0]}]])} else {\n`
      ifcount += 2
    } else if (a[1] !== null) {
      nextFunc += `if (!Array.isArray(${val})) {p=path.join(".");err[p]=err[p]||[];err[p].push(["array", []])} else {\n`
      nextFunc += `if (${val}.length > ${a[1]}) {p=path.join(".");err[p]=err[p]||[];err[p].push(["array_length_max", [${a[1]}]])} else {\n`
      ifcount += 2
    }

    const i = uid()
    nextFunc += `var ${i};for (${i}=0;${i}<${val}.length;${i}++) {\n`
    if (params.length) {
      nextFunc += `path.push(${i})\n`
      nextFunc += astarrvalue(curr, params, `${val}[${i}]`)
      nextFunc += `path.pop()\n`
    } else {
      nextFunc += `path.push(${i})\n`
      nextFunc += astvalue(curr, `${val}[${i}]`)
      nextFunc += `path.pop()\n`
    }
    nextFunc += "}\n"
    nextFunc += "}\n".repeat(ifcount) // end if
    return nextFunc
  }

  const func = `var err={}\nvar path=[]\nvar p=""\n${astvalue(rule, "v")}return err`
  return new Function("v", func) as (value: any) => {[path: string]: Array<[string, Scalar[]]>} // tslint:disable-line function-constructor
}

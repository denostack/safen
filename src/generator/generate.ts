import { AstExpr, AstTester, AstValue } from "../interfaces/ast"
import { TesterMap } from "../interfaces/common"


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
        return testers[curr.n].template(val, curr.p as string[])
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
  return new Function("v", func) as (value: any) => boolean
}

export function generateAssert(rule: AstValue, testers: TesterMap = {}): (value: any) => {[path: string]: string[]} {
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
            nextFunc += `if (typeof ${nextVal} === "undefined") {p=path.join(".");err[p]=err[p]||[];err[p].push("required")} else {\n`
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
        return `(function(){var r=${testers[curr.n].template(val, curr.p as string[])};if(!r){p=path.join(".");err[p]=err[p]||[];err[p].push("${curr.n}")};return r})()`
    }
  }

  function astarrvalue(curr: AstValue, params: Array<[string|null, string|null]|string|null>, val: string): string {
    let nextFunc = ""
    params = params.slice()
    const a = params.pop()!
    if (a === null) {
      nextFunc += `if (!Array.isArray(${val})) {p=path.join(".");err[p]=err[p]||[];err[p].push("array")} else {\n`
    } else if (typeof a === "string") {
      nextFunc += `if (!Array.isArray(${val}) || ${val}.length !== ${a}) {p=path.join(".");err[p]=err[p]||[];err[p].push("array")} else {\n`
    } else if (a[0] !== null && a[1] !== null) {
      nextFunc += `if (!Array.isArray(${val}) || ${val}.length < ${a[0]} || ${val}.length > ${a[1]}) {p=path.join(".");err[p]=err[p]||[];err[p].push("array")} else {\n`
    } else if (a[0] !== null) {
      nextFunc += `if (!Array.isArray(${val}) || ${val}.length < ${a[0]}) {p=path.join(".");err[p]=err[p]||[];err[p].push("array")} else {\n`
    } else if (a[1] !== null) {
      nextFunc += `if (!Array.isArray(${val}) || ${val}.length > ${a[1]}) {p=path.join(".");err[p]=err[p]||[];err[p].push("array")} else {\n`
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
    nextFunc += "}\n" // end if
    return nextFunc
  }

  const func = `var err={}\nvar path=[]\nvar p=""\n${astvalue(rule, "v")}return err`
  return new Function("v", func) as (value: any) => {[path: string]: string[]}
}

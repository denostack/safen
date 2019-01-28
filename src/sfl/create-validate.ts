import { TesterMap } from "../interfaces/common"
import {
  SflAndTester,
  SflOrTester,
  SflScalarTester,
  SflTester
  } from "../interfaces/sfl"

let uniq = 0
const uid = () => `t${uniq++}`


function tester(curr: SflTester, val: string, testers: TesterMap): string {
  let nxt = ""
  switch (curr.type) {
    case "object":
      for (const [key, {optional, value}] of Object.entries(curr.properties)) {
        const nxtval = `${val}.${key}`
        if (optional) { // optional start
          nxt += `if(typeof ${nxtval}!=="undefined"){`
        } else {
          nxt += `if(typeof ${nxtval}==="undefined"){return false}`
        }
        nxt += tester(value, nxtval, testers)
        if (optional) { // optional end
          nxt += `}`
        }
      }
      return nxt
    case "array":
      const hasMin = typeof curr.min !== "undefined" && curr.min !== null
      const hasMax = typeof curr.max !== "undefined" && curr.max !== null
      if (hasMin && hasMax) {
        nxt += `if(!Array.isArray(${val})||${val}.length<${curr.min}||${val}.length>${curr.max}){return false}`
      } else if (hasMin) {
        nxt += `if(!Array.isArray(${val})||${val}.length<${curr.min}){return false}`
      } else if (hasMax) {
        nxt += `if(!Array.isArray(${val})||${val}.length>${curr.max}){return false}`
      } else {
        nxt += `if(!Array.isArray(${val})){return false}`
      }
      const i = uid()
      nxt += `var ${i};for(${i}=0;${i}<${val}.length;${i}++){`
      nxt += tester(curr.value, `${val}[${i}]`, testers)
      nxt += "}"
      return nxt
    case "and":
    case "or":
    case "scalar":
      return `if(!(${astcondition(curr, val, testers)})){return false}`
  }
}

function astcondition(curr: SflOrTester | SflAndTester | SflScalarTester, val: string, testers: TesterMap): string {
  switch (curr.type) {
    case "scalar":
      return testers[curr.name](val, curr.params, uid)
  }
  const conditions = curr.params.map((param) => {
    switch (param.type) {
      case "object":
      case "array":
        return `(function(){${tester(param, val, testers)} return true})()`
    }
    return astcondition(param, val, testers)
  })
  return `(${conditions.join(curr.type === "and" ? "&&" : "||")})`
}

export function createValidate(rule: SflTester, testers: TesterMap = {}): (value: any) => boolean {
  uniq = 0
  return new Function(
    "v",
    `${tester(rule, "v", testers)} return true`
  ) as (value: any) => boolean // tslint:disable-line function-constructor
}

import { InvalidValueError } from "../errors/invalid-value-error"
import { UndefinedError } from "../errors/undefined-error"
import { MessageMap, TesterMap } from "../interfaces/common"
import { SflTester } from "../interfaces/sfl"

// tslint:disable function-constructor

let uniq = 0
let testers: TesterMap = {}
const uid = () => `t${uniq++}`

function error(name: string, args: any[] = []) {
  const escapedName = name.replace("\"", "\\\"")
  const escapedParams = args.map((arg) => {
    return arg instanceof RegExp ?
      `"${(arg + "").replace("\\", "\\\\").replace("\"", "\\\"")}"` :
      JSON.stringify(arg)
  }).join(",")
  return `{message:message(path.join("").replace(/^\\./,""),"${escapedName}",[${escapedParams}]),path:path.join("").replace(/^\\./,""),reason:"${escapedName}",params:[${escapedParams}]}`
}

function tester(curr: SflTester, val: string): string {
  switch (curr.type) {
    case "object": {
      const merged = uid()
      let nxt = `(function(){var ${merged}=[];`
      nxt += `if(typeof ${val}!=="object"||${val}===null){return [${error("object")}]}`
      for (const key of Object.keys(curr.properties)) {
        const {optional, value} = curr.properties[key]
        const nxtval = `${val}.${key}`
        nxt += `path.push(".${key.replace("\"", "\\\"")}");`
        if (optional) { // optional start
          nxt += `if(typeof ${nxtval}!=="undefined"){`
            +   `${merged}=${merged}.concat(${tester(value, nxtval)})`
            + `}`
        } else {
          nxt += `if(typeof ${nxtval}!=="undefined"){`
            +   `${merged}=${merged}.concat(${tester(value, nxtval)})`
            + `}else{`
            +   `${merged}.push(${error("required")})`
            + `}`
        }
        nxt += "path.pop();"
      }
      nxt += `return ${merged}})()`
      return nxt
    }
    case "array": {
      let nxt = `(function(){`
        + `if(!Array.isArray(${val})){return[${error("array")}]}`
      const hasMin = typeof curr.min !== "undefined" && curr.min !== null
      const hasMax = typeof curr.max !== "undefined" && curr.max !== null
      if (hasMin && hasMax && curr.min === curr.max) {
        nxt += `if(${val}.length!==${curr.max}){return[${error("array_length", [curr.min])}]}`
      } else if (hasMin && hasMax) {
        nxt += `if(${val}.length<${curr.min}||${val}.length>${curr.max}){return[${error("array_length_between", [curr.min, curr.max])}]}`
      } else if (hasMin) {
        nxt += `if(${val}.length<${curr.min}){return[${error("array_length_min", [curr.min])}]}`
      } else if (hasMax) {
        nxt += `if(${val}.length>${curr.max}){return[${error("array_length_max", [curr.max])}]}`
      }
      const merged = uid()
      const i = uid()
      nxt += `var ${merged}=[];`
        + `for(var ${i}=0;${i}<${val}.length;${i}++){`
        +   `path.push("[" + ${i} + "]");`
        +   `${merged}=${merged}.concat(${tester(curr.value, `${val}[${i}]`)});`
        +   `path.pop()`
        + `}`
        + `return ${merged}})()`
      return nxt
    }
    case "and": {
      const result = uid()
      return `(function(){`
        + `var ${result}=${curr.params.map((param) => tester(param, val)).join(`;`
        +   `if(${result}.length){return ${result}}`
        +   `${result}=`)};`
        + `if(${result}.length){return ${result}}`
        + `return[]`
        + `})()`
    }
    case "or": {
      const merged = uid()
      const result = uid()
      return `(function(){`
        + `var ${merged}=[],${result}=${curr.params.map((param) => tester(param, val)).join(`;`
        +   `if(${result}.length===0){return []}`
        +   `${merged}=${merged}.concat(${result});`
        +   `${result}=`)};`
        + `if(${result}.length===0){return []}`
        + `${merged}=${merged}.concat(${result});`
        + `return ${merged}`
        + `})()`
    }
    case "scalar":
      if (typeof testers[curr.name] !== "function") {
        throw new UndefinedError(`Undefined Error: "${curr.name}" is an undefined tester.`, curr)
      }
      return `(function(){`
        + `if(!(${testers[curr.name](val, curr.params, uid)})){`
        +   `return[${error(curr.name, curr.params)}]`
        + `}return[]`
        + `})()`
  }
  return "[]"
}

export function createAssert(rule: SflTester, testerMap: TesterMap = {}, messages: MessageMap = {}): (value: any) => boolean {
  uniq = 0
  testers = testerMap
  return (new Function(
    "InvalidValueError",
    "message",
    `return function(v){`
      + `var path=[];var errors=${tester(rule, "v")};`
      + `if(errors.length)throw new InvalidValueError(errors)`
      + `}`
  ))(InvalidValueError, (path: string, reason: string, params: any[]) => {
    let message = (messages[reason] || ["The :path is invalid value.", "It is invalid value."])[path ? 0 : 1]
    message = message.replace(":path", path)
    params.forEach((param, index) => {
      message = message.replace(`:param${index}`, JSON.stringify(param))
    })
    return message.replace(/\:param[0-9]+/g, "").replace(/\:params/g, JSON.stringify(params))
  }) as (value: any) => boolean
}

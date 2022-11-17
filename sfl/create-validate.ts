/* eslint-disable no-new-func */
import { UndefinedError } from "../errors/undefined-error.ts";
import { TesterMap } from "../interfaces/common.ts";
import { SflTester } from "../interfaces/sfl.ts";

let uniq = 0;
let testers: TesterMap = {};
const uid = () => `t${uniq++}`;

function tester(curr: SflTester, val: string): string {
  let nxt = "";
  switch (curr.type) {
    case "object":
      nxt += "(function(){";
      nxt += `if(typeof ${val}!=='object'||${val}===null){return false}`;
      for (const key of Object.keys(curr.properties)) {
        const { optional, value } = curr.properties[key];
        const nxtval = `${val}.${key}`;
        if (optional) { // optional start
          nxt += `if(typeof ${nxtval}!=='undefined'){`;
        } else {
          nxt += `if(typeof ${nxtval}==='undefined'){return false}`;
        }
        nxt += `if(!(${tester(value, nxtval)})){return false}`;
        if (optional) { // optional end
          nxt += "}";
        }
      }
      nxt += ";return true})()";
      return nxt;
    case "array": {
      nxt += "(function(){";
      const hasMin = typeof curr.min !== "undefined" && curr.min !== null;
      const hasMax = typeof curr.max !== "undefined" && curr.max !== null;
      if (hasMin && hasMax) {
        nxt +=
          `if(!Array.isArray(${val})||${val}.length<${curr.min}||${val}.length>${curr.max}){return false}`;
      } else if (hasMin) {
        nxt +=
          `if(!Array.isArray(${val})||${val}.length<${curr.min}){return false}`;
      } else if (hasMax) {
        nxt +=
          `if(!Array.isArray(${val})||${val}.length>${curr.max}){return false}`;
      } else {
        nxt += `if(!Array.isArray(${val})){return false}`;
      }
      const i = uid();
      nxt += `for(var ${i}=0;${i}<${val}.length;${i}++){`;
      nxt += `if(!(${tester(curr.value, `${val}[${i}]`)})){return false}`;
      nxt += "}";
      nxt += "return true})()";
      return nxt;
    }
    case "and":
      return `(${curr.params.map((param) => tester(param, val)).join("&&")})`;
    case "or":
      return `(${curr.params.map((param) => tester(param, val)).join("||")})`;
    case "scalar":
      if (typeof testers[curr.name] !== "function") {
        throw new UndefinedError(
          `Undefined Error: "${curr.name}" is an undefined tester.`,
          curr,
        );
      }
      return testers[curr.name](val, curr.params, uid);
  }
}

export function createValidate(
  rule: SflTester,
  testerMap: TesterMap = {},
): (data: any) => boolean {
  uniq = 0;
  testers = testerMap;
  return new Function(
    `return function(v){return ${tester(rule, "v")}}`,
  )() as (data: any) => boolean;
}

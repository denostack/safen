import { Tester } from "../interfaces/common"


export const jsonTester: Tester = {
  template(value) {
    return `(function(){try{JSON.parse(${value});return true}catch(e){}return false})()`
  },
}

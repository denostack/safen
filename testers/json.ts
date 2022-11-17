import { Tester } from "../interfaces/common.ts";

export const jsonTester: Tester = (value) =>
  `(function(){try{JSON.parse(${value});return true}catch(e){}return false})()`;

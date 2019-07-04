import { Tester } from '../interfaces/common'

// ref. https://github.com/chriso/validator.js/blob/master/src/lib/isAfter.js
export const afterTester: Tester = (value, params, gen) => {
  const comparison = gen()
  const origin = gen()
  return '(function(){'
    + `var ${comparison}=Date.parse(${params[0] ? JSON.stringify(params[0]) : 'new Date()'});`
    + `var ${origin}=Date.parse(${value});`
    + `return(${comparison}&&${origin}&&${origin}>${comparison})`
    + '})()'
}

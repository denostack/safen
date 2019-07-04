import { Tester } from '../interfaces/common'

// ref. https://github.com/chriso/validator.js/blob/master/src/lib/isBefore.js
export const beforeTester: Tester = (value, params, gen) => {
  const comparison = gen()
  const origin = gen()
  return '(function(){'
    + `var ${comparison}=Date.parse(${params[0] ? `"${params[0]}"` : 'new Date()'});`
    + `var ${origin}=Date.parse(${value});`
    + `return (${comparison}&&${origin}&&${origin}<${comparison})`
    + '})()'
}

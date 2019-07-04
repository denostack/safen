import { Validator } from '../validator/validator'
import { create } from './create'

export function sfl<T = any>(literals: TemplateStringsArray, ...placeholders: string[]): Validator<T> {
  let result = ''
  placeholders.forEach((placeholder, index) => {
    result += literals[index] + placeholder
  })
  result += literals[literals.length - 1]
  return create<T>(result)
}

import { create } from "./create"

export function sfl(literals: TemplateStringsArray, ...placeholders: string[]) {
  let result = ``
  placeholders.forEach((placeholder, index) => {
    result += literals[index] + placeholder
  })
  result += literals[literals.length - 1]
  return create(result)
}

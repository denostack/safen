import { SflTester } from "../interfaces/sfl"

function escape(value: any): string {
  if (value instanceof RegExp) {
    return `${value}`
  }
  return JSON.stringify(value)
}

function brace(param: SflTester, indent: number, formatted = false) {
  if (param.type === "and" || param.type === "or") {
    return `(${tester(param, indent, formatted)})`
  }
  return tester(param, indent, formatted)
}

function tester(ast: SflTester, indent: number, formatted = false): string {
  switch (ast.type) {
    case "scalar":
      return ast.params.length
        ? `${ast.name}(${ast.params.map(escape).join(formatted ? ", " : ",")})`
        : ast.name
    case "and":
      return ast.params.map(param => brace(param, indent, formatted)).join(formatted ? " & " : "&")
    case "or":
      return ast.params.map(param => brace(param, indent, formatted)).join(formatted ? " | " : "|")
    case "array":
      const hasMin = typeof ast.min !== "undefined"
      const hasMax = typeof ast.max !== "undefined"
      if (hasMin && ast.min === ast.max) {
        return `${brace(ast.value, indent, formatted)}[${ast.min}]`
      } else if (hasMin && hasMax) {
        return `${brace(ast.value, indent, formatted)}[${ast.min}:${ast.max}]`
      } else if (hasMin) {
        return `${brace(ast.value, indent, formatted)}[${ast.min}:]`
      } else if (hasMax) {
        return `${brace(ast.value, indent, formatted)}[:${ast.max}]`
      }
      return `${brace(ast.value, indent, formatted)}[]`
    case "object":
      const keys = Object.keys(ast.properties)
      if (keys.length === 0) {
        return "{}"
      }
      const entries = keys.map((key) => {
        return `${formatted ? "  ".repeat(indent + 1) : ""}${key}${ast.properties[key].optional ? "?" : ""}${formatted ? ": " : ":"}${tester(ast.properties[key].value, indent + 1, formatted)}`
      })
      return formatted ? `{\n${entries.join(",\n")}\n${"  ".repeat(indent)}}` : `{${entries.join(",")}}`
  }
  throw new Error()
}

export function stringify(ast: SflTester, formatted = false): string {
  return tester(ast, 0, formatted)
}

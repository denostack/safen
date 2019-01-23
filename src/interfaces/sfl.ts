
export type SflParam = RegExp | string | number | boolean | null

export type SflTester = SflObjectTester | SflArrayTester | SflOrTester | SflAndTester | SflScalarTester

export interface SflObjectTester {
  type: "object"
  properties: {
    [key: string]: SflObjectProperty
  }
}

export interface SflObjectProperty {
  optional: boolean
  value: SflTester
}

export interface SflArrayTester {
  type: "array"
  min?: number
  max?: number
  value: SflTester
}

export interface SflNotTester {
  type: "not"
  value: SflTester
}

export interface SflOrTester {
  type: "or"
  params: SflTester[]
}

export interface SflAndTester {
  type: "and"
  params: SflTester[]
}

export interface SflScalarTester {
  type: "scalar"
  name: string
  params: SflParam[]
}

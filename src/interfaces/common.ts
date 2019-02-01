
export type Tester = (value: string, params: any[], generateVariable: () => string) => string

export interface TesterMap {
  [name: string]: Tester
}

export interface MessageMap {
  [key: string]: [string, string]
}

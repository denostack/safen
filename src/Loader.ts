
import * as types from "./types"

import AlwaysTrueTester from "./testers/AlwaysTrueTester"
import AlwaysFalseTester from "./testers/AlwaysFalseTester"

export default class Loader {

  private testers: types.TesterMap
  private caches: types.TesterCacheMap

  constructor(testers?: types.TesterMap) {
    this.testers = Object.assign({
      always_false: AlwaysFalseTester,
      always_true: AlwaysTrueTester,
    }, testers || {})
    this.caches = {}
  }

  public load(tester: string): types.Tester {
    const [name, args] = this.getMethodAndParams(tester)
    if (!(tester in this.caches)) {
      this.caches[tester] = this.create(name, args)
    }
    return this.caches[tester]
  }

  public create(tester: string, args: any[]): types.Tester {
      const className = this.getClassName(tester)
      return new className(...args)
  }

  private getMethodAndParams(pattern: string): [string, any[]] {
    if (pattern.indexOf(":") === -1) {
      return [pattern, []]
    }
    const [method, argstr] = pattern.split(":")
    const args = argstr.split(",")
    return [method, args]
  }

  private getClassName(name: string): {new(): types.Tester} {
    if (name in this.testers) {
      return this.testers[name]
    }
    throw new Error(`tester not found : ${name}`)
  }
}

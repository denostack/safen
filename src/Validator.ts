
import Loader from "./Loader"
import ErrorBag from "./throwable/ErrorBag"
import ErrorThrower from "./throwable/ErrorThrower"
import InvalidValueError from "./InvalidValueError"
import * as types from "./types"
import * as util from "./util"
import * as _ from "lodash"

export default class Validator {

  private loader: Loader
  private rule: types.NormalizableRule

  constructor(loader: Loader, rule: types.NormalizableRule) {
    this.loader = loader
    this.rule = rule
  }

  public assert(data: any): void {
    const errors = new ErrorBag()
    this.checkSingle(util.normalize(this.rule), errors, data, data, [])
    if (errors.getErrors().length) {
      throw new InvalidValueError(errors.getErrors())
    }
  }

  public validate(data: any): boolean {
    const errors = new ErrorThrower()
    try {
      this.checkSingle(util.normalize(this.rule), errors, data, data, [])
    } catch (e) {
      return false
    }
    return true
  }

  private checkSingle(rule: types.NormalizedRule, thrower: types.ErrorThowable, data: any, origin: any, keys: string[]): void {
      // $dataKeys = array_flip(is_array($data) ? array_keys($data) : [])
    for (const condition of rule[0]) {
      const tester = this.loader.load(condition)
      if (!this.test(tester, data, origin, keys)) {
        thrower.throws(condition, keys)
      }
    }
    for (const [[name, iterators, optional], children] of rule[1]) {
      //     unset($dataKeys[$name]); // remove
      // check optional
      if (optional && data[name] === undefined) {
        continue
      }
      keys.push(name)
      if (data[name] === undefined) {
        thrower.throws("required", keys)
      } else if (iterators.length && !_.isArray(data[name])) {
        thrower.throws("array", keys)
      } else {
        this.checkChild(iterators, children, thrower, data[name], origin, keys)
      }
      keys.pop()
    }
      // foreach ($dataKeys as $dataKey => $_) {
      //     $thrower->throws('unknown', array_merge($keys, [$dataKey]));
      // }
  }

  private checkChild(iterators: Array<number|null>, rule: types.NormalizedRule, thrower: types.ErrorThowable, data: any, origin: any, keys: string[]): void {
    if (iterators.length) {
      const iterator = iterators.shift()
      if (iterator && iterator < data.length) {
        thrower.throws(`array_length:${iterator}`, keys)
        return
      }
      for (const index of Object.keys(data)) {
        keys.push(index)
        this.checkChild(iterators, rule, thrower, data[index], origin, keys)
        keys.pop()
      }
    } else {
      this.checkSingle(rule, thrower, data, origin, keys)
    }
  }

  private test(tester: types.Tester, data: any, origin: any, keys: string[]): boolean {
    if (tester.before) {
      const deps = tester.before(data, origin, keys)
      for (let dep of deps) {
        if (!_.isArray(dep)) {
          dep = [dep, []]
        }
        const [className, args] = dep as [{new(): types.Tester}, any[]]
        if (!this.test(new className(...args), data, origin, keys)) {
          return false
        }
      }
    }
    return tester.test(data, origin, keys)
  }
}

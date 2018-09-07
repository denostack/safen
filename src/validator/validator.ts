
import * as _ from "lodash"
import { InvalidValueError } from "../errors/invalid-value-error"
import { ErrorThowable, MessageLoader, NormalizableRule, NormalizedRule, Tester, TesterLoader } from "../interfaces/tester"
import { MapLoader as DefaultMessageLoader } from "../message-loader/MapLoader"
import { MapLoader as DefaultTesterLoader } from "../tester-loader/MapLoader"
import { ErrorBag } from "../throwable/ErrorBag"
import { ErrorThrower } from "../throwable/ErrorThrower"
import * as util from "../util"

export class Validator {

  private rule: NormalizableRule

  private testerLoader: TesterLoader

  private messageLoader: MessageLoader

  constructor(rule: NormalizableRule, testerLoader?: TesterLoader, messageLoader?: MessageLoader) {
    this.rule = rule
    this.testerLoader = testerLoader || new DefaultTesterLoader()
    this.messageLoader = messageLoader || new DefaultMessageLoader()
  }

  public assert(data: any): void {
    const errors = new ErrorBag()
    this.testOne(util.normalize(this.rule), errors, data, data, [])
    if (errors.getErrors().length) {
      throw new InvalidValueError(errors.getErrors(), this.messageLoader)
    }
  }

  public validate(data: any): boolean {
    const errors = new ErrorThrower()
    try {
      this.testOne(util.normalize(this.rule), errors, data, data, [])
    } catch (e) {
      return false
    }
    return true
  }

  private testOne(rule: NormalizedRule, thrower: ErrorThowable, data: any, origin: any, keys: string[]): void {
    for (const condition of rule[0]) {
      const tester = this.testerLoader.load(condition)
      if (!this.test(tester, data, origin, keys)) {
        thrower.throws(condition, keys)
      }
    }
    for (const [[name, iterators, optional], children] of rule[1]) {
      if (optional && (data === undefined || data === null || data[name] === undefined || data[name] === null)) {
        continue
      }
      keys.push(name)
      if (data === undefined || data === null || data[name] === undefined || data[name] === null) {
        thrower.throws("required", keys)
      } else if (iterators.length && !_.isArray(data[name])) {
        thrower.throws("array", keys)
      } else {
        this.testChildren(iterators.slice(), children, thrower, data[name], origin, keys.slice())
      }
      keys.pop()
    }
  }

  private testChildren(iterators: Array<string|null>, rule: NormalizedRule, thrower: ErrorThowable, data: any, origin: any, keys: string[]): void {
    if (iterators.length) {
      const iterator = iterators.shift() // string|null
      if (iterator) {
        if (iterator.indexOf(":") > -1) {
          const [lengthMin, lengthMax] = iterator.split(":")
          if (lengthMin && lengthMax) {
            if (+lengthMin > data.length || +lengthMax < data.length) {
              return thrower.throws(`array_length_between:${lengthMin},${lengthMax}`, keys)
            }
          } else if (lengthMin) {
            if (+lengthMin > data.length) {
              return thrower.throws(`array_length_min:${lengthMin}`, keys)
            }
          } else if (lengthMax) {
            if (+lengthMax < data.length) {
              return thrower.throws(`array_length_max:${lengthMax}`, keys)
            }
          }
        } else if (+iterator !== data.length) {
          return thrower.throws(`array_length:${iterator}`, keys)
        }
      }
      for (const index of Object.keys(data)) {
        keys.push(index)
        if (data[index] === undefined) {
          thrower.throws("required", keys)
        } else if (iterators.length && !_.isArray(data[index])) {
          thrower.throws("array", keys)
        } else {
          this.testChildren(iterators.slice(), rule, thrower, data[index], origin, keys.slice())
        }
        keys.pop()
      }
    } else {
      this.testOne(rule, thrower, data, origin, keys.slice())
    }
  }

  private test(tester: Tester, data: any, origin: any, keys: string[]): boolean {
    if (tester.before) {
      const deps = tester.before(data, origin, keys)
      for (let dep of deps) {
        if (!_.isArray(dep)) {
          dep = [dep, []]
        }
        const [className, args] = dep as [{new(...args: any[]): Tester}, any[]]
        if (!this.test(new className(...args), data, origin, keys)) {
          return false
        }
      }
    }
    return tester.test(data, origin, keys)
  }
}

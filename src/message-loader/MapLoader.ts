
import * as types from "../types"
import * as _ from "lodash"

const REASON_REGEX = /^(\w+)\s*(?::\s*([\s\w,]*))?\s*(?:@\s*(\w+(?:(?:\.\w+)|(?:\[\d+\]))*))?$/u
const REASON_CORRECTION_REGEX = /(\w+)\s*(?::\s*([\s\w,]*))?\s*(?:@\s*(\w+(?:(?:\.\w+)|(?:\[\d+\]))*))?/u

function reasonParse(reason: string): [string, string[], string] {
  if (!REASON_REGEX.test(reason)) {
    const correction = reason.match(REASON_CORRECTION_REGEX)
    throw new Error(`Invalid target name. Did you mean this? '${(correction && correction[0]) || "unknown"}'.`)
  }
  const matches = reason.match(REASON_REGEX) as RegExpMatchArray
  return [
    matches[1],
    matches[2] ? (matches[2]).split(",").map(w => w.trim()).filter(w => w) : [],
    matches[3] ? matches[3] : "",
  ]
}

export class MapLoader implements types.MessageLoader {

  private messages: types.MessageMap

  public constructor(messages?: types.MessageMap) {
    this.messages = messages || {}
  }

  public load(reason: string): string {
    const [tester, args, attribute] = reasonParse(reason)
    let messageTuple = (this.messages[tester] || "Something is wrong.")
    if (!_.isArray(messageTuple)) {
      messageTuple = [messageTuple, messageTuple]
    }
    let message = attribute ? messageTuple[0] : messageTuple[1]
    message = message
      .replace(":attribute", attribute)
      .replace(":tester", tester)

    for (const i of args.keys()) {
      message = message.replace(`:arguments${i}`, args[i])
    }
    return message
  }
}

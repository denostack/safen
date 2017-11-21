
import * as types from "../types"
import {StringTester} from "./lodash-testers"

// source from. https://github.com/Sembiance/email-validator

const EMAIL_REGEX = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export default class EmailTester implements types.Tester {

  public before(): Array<[{new(): types.Tester}, any[]] | {new(): types.Tester}> {
    return [
      StringTester,
    ]
  }

  public test(data: any): boolean {
    if (!data) {
      return false
    }
    console.log(data.length)
    if (data.length > 254) {
      return false
    }
    if (!EMAIL_REGEX.test(data)) {
      return false
    }
    const [username, domain] = data.split("@") as [string, string]
    if (username.length > 64) {
      return false
    }
    const domainParts = domain.split(".")
    if (domainParts.some(part => part.length > 63)) {
      return false
    }

    return true
  }
}

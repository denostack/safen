import { Tester } from "../interfaces/common"


export const urlTester: Tester = {
  template(value) {
    return `/^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$/.test(${value})`
  },
}

import * as safen from "./safen-axios"

async function main() {
  const axios = safen.create(`{
    ip: string & ip("v4")
  }`)
  const response = await axios.get<{ip: string}>("https://api.ipify.org?format=json")

  console.log(response.data)
}

main()

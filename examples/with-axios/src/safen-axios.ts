import axios, { AxiosInstance } from "axios"
import { create as createSafen } from "safen"

export function create(ctx: string): AxiosInstance {
  const validator = createSafen(ctx)
  const instance = axios.create()
  instance.interceptors.response.use((response) => {
    validator.assert(response.data)
    return response
  })
  return instance
}

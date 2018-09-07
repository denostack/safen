
import { ErrorThowable } from "../interfaces/tester"

export class ErrorThrower implements ErrorThowable {
  public throws(): void {
    throw new Error()
  }
}

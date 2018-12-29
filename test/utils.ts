
export function expectThrow(handler: () => void, expected: any) {
  try {
    handler()
    fail()
  } catch (e) {
    const errors = (e as any).errors
    if (errors) {
      expect(errors).toEqual(expected)
    } else {
      console.error(e) // tslint:disable-line
    }
  }
}

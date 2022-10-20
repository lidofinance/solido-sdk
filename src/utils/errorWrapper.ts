export class ErrorWrapper extends Error {
  constructor(public code: string, message?: string) {
    super(message)
  }

  static addCode(error, code) {
    return Object.assign(error, { code })
  }
}

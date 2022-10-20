import {ERROR_CODES, ERROR_CODES_DESC, ERROR_MESSAGE} from '@/constants';

export class ErrorWrapper extends Error {
  public codeDesc: string | undefined;

  constructor(public code: ERROR_CODES, message: string = ERROR_MESSAGE[code]) {
    super(message);
    this.codeDesc = ERROR_CODES_DESC[code];
  }

  static addCode(error, code) {
    if (ERROR_CODES_DESC[code]) {
      return Object.assign(error, { code, codeDesc: ERROR_CODES_DESC[code] })
    }
    return Object.assign(error, { code })
  }
}

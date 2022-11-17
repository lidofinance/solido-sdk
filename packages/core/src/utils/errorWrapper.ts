import { ERROR_CODE, ERROR_CODE_DESC, ERROR_MESSAGE } from '@/constants';

interface IErrorWrapper {
  code: ERROR_CODE;
  error?: unknown;
  message?: string;
}

export class ErrorWrapper extends Error {
  public codeDesc: string | undefined;
  public code: number | undefined;

  constructor({ code, error = {}, message = ERROR_MESSAGE[code] }: IErrorWrapper) {
    super(message);
    Object.assign(this, error);
    this.codeDesc = ERROR_CODE_DESC[code];
    this.code = code;
  }
}

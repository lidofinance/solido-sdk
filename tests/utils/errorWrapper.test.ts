import { ErrorWrapper } from '@/utils/errorWrapper';
import { ERROR_CODE, ERROR_CODE_DESC, ERROR_MESSAGE } from '@/constants';

describe('ErrorWrapper', () => {
  test('fields correctness', () => {
    const error = new ErrorWrapper({ code: ERROR_CODE.NO_ACCOUNT_INFO, error: new Error('Something wrong') });

    expect(error.code).toBe(ERROR_CODE.NO_ACCOUNT_INFO);
    expect(error.message).toBe(ERROR_MESSAGE[ERROR_CODE.NO_ACCOUNT_INFO]);
    expect(error.codeDesc).toBe(ERROR_CODE_DESC[ERROR_CODE.NO_ACCOUNT_INFO]);
  });
});

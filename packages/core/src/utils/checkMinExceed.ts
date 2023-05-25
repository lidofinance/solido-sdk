import { lamportsToSolUp, solToLamports } from '@/utils/formatters';
import { ERROR_CODE } from '@common/constants';
import { ErrorWrapper } from '@common/errorWrapper';

export const checkMinExceed = (amount: number, minInLamports: number) => {
  if (solToLamports(amount) <= minInLamports) {
    throw new ErrorWrapper({
      code: ERROR_CODE.EXCEED_MIN,
      message: `Amount must be greater than rent-exempt fee(${lamportsToSolUp(minInLamports)})`,
    });
  }
};

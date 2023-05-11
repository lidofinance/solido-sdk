import { lamportsToSol, solToLamports } from '@/utils/formatters';
import { ErrorWrapper } from '@common/errorWrapper';
import { ERROR_CODE } from '@common/constants';

export const checkMinExceed = (amount: number, minInLamports: number) => {
  if (solToLamports(amount) <= minInLamports) {
    throw new ErrorWrapper({
      code: ERROR_CODE.EXCEED_MIN,
      message: `Amount must be greater than rent-exempt fee(${lamportsToSol(minInLamports)})`,
    });
  }
};

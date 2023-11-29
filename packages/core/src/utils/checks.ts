import { lamportsToSol, lamportsToSolUp } from '@/utils/formatters';
import { ERROR_CODE } from '@common/constants';
import { ErrorWrapper } from '@common/errorWrapper';

export const checkMaxExceed = (amount: number, maxInLamports: number) => {
  if (amount > maxInLamports) {
    throw new ErrorWrapper({
      code: ERROR_CODE.EXCEED_MAX,
      message: `Amount must not exceed MAX(${lamportsToSol(maxInLamports)})`,
    });
  }
};

export const checkMinExceed = (amount: number, minInLamports: number) => {
  if (amount <= minInLamports) {
    throw new ErrorWrapper({
      code: ERROR_CODE.EXCEED_MIN,
      message: `Amount must be greater than rent-exempt fee(${lamportsToSolUp(minInLamports)})`,
    });
  }
};

export const checkUnstakeAvailable = (isUnStakeAvailable: boolean) => {
  if (!isUnStakeAvailable) {
    throw new ErrorWrapper({
      code: ERROR_CODE.UNSTAKE_UNAVAILABLE,
    });
  }
};

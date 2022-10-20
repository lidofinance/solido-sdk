import { lamportsToSol, solToLamports } from '@/utils/formatters';
import { ErrorWrapper } from '@/utils/errorWrapper';
import { ERROR_CODES } from '@/constants';

export const checkMaxExceed = (amount: number, maxInLamports: number) => {
  if (solToLamports(amount) > maxInLamports) {
    throw new ErrorWrapper(ERROR_CODES.EXCEED_MAX, `Amount must not exceed MAX(${lamportsToSol(maxInLamports)})`);
  }
};

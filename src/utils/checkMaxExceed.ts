import { lamportsToSol, solToLamports } from '@/utils/formatters';

export const checkMaxExceed = (amount: number, maxInLamports: number) => {
  if (solToLamports(amount) > maxInLamports) {
    throw new Error(`Amount must not exceed MAX(${lamportsToSol(maxInLamports)})`);
  }
};

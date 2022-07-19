import { lamportsToSol, solToLamports } from '@/utils/formatters';

// TODO change amount
export const checkMaxExceed = (amount: any, maxInLamports: number) => {
  if (solToLamports(amount) > maxInLamports) {
    throw new Error(`Amount must not exceed MAX(${lamportsToSol(maxInLamports)})`);
  }
};

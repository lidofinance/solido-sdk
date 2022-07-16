import { lamportsToSol, solToLamports } from '@/utils/formatters';

export const checkMaxExceed = (amount, maxInLamports: number) => {
  if (solToLamports(amount) > maxInLamports) {
    throw new Error(`Amount must not exceed MAX(${lamportsToSol(maxInLamports)})`);
  }
}

import { LAMPORTS_PER_SOL } from '@solana/web3.js';

// To use the lower(floor) value while calculating decimal precision
export const toPrecision = (value, precision) => Math.floor(value * 10 ** precision) / 10 ** precision;

export const lamportsToSol = (balanceInLamports, precision = 4) =>
  toPrecision(balanceInLamports / LAMPORTS_PER_SOL, precision);

export const solToLamports = (balanceInSol) => balanceInSol * LAMPORTS_PER_SOL;

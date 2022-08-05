import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const formatWithCommas = (x: number) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// To use the lower(floor) value while calculating decimal precision
export const toPrecision = (value: number, precision: number) =>
  Math.floor(value * 10 ** precision) / 10 ** precision;

export const lamportsToSol = (balanceInLamports: number, precision = 4) =>
  toPrecision(balanceInLamports / LAMPORTS_PER_SOL, precision);

export const solToLamports = (balanceInSol: number) => balanceInSol * LAMPORTS_PER_SOL;

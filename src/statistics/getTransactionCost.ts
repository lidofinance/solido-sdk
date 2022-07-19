import { lamportsToSol, toPrecision } from '@/utils/formatters';

import { INSTRUCTION } from '@/constants';
import { SolidoSDK } from '@/index';

import { getSolPrice } from '@/api/solPrice';

type TransactionCost = {
  costInUsd: number;
  costInSol: number;
  costInLamports: number;
}

export async function getTransactionCost(this: SolidoSDK, instruction: INSTRUCTION): Promise<TransactionCost> {
  const {
    feeCalculator: { lamportsPerSignature },
  } = await this.connection.getRecentBlockhash();

  const solPriceInUsd = await getSolPrice();

  const costInLamports = instruction * lamportsPerSignature;
  const costInSol = lamportsToSol(costInLamports, 6);
  const costInUsd = toPrecision(costInSol * solPriceInUsd, 5);

  return { costInUsd, costInSol, costInLamports, };
}

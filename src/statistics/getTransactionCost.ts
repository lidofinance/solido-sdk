import { lamportsToSol } from '@/utils/formatters';
import { INSTRUCTIONS } from '@/constants';
import { SolidoSDK } from '@/index';
import { getSolPrice } from '@/api/solPrice';

export async function getTransactionCost(this: SolidoSDK, instructions: INSTRUCTIONS) {
  const {
    feeCalculator: { lamportsPerSignature },
  } = await this.connection.getRecentBlockhash();

  const solPriceInUsd = await getSolPrice();

  const costInLamports = instructions * lamportsPerSignature;
  const costInUsd = lamportsToSol(costInLamports, 6) * solPriceInUsd;

  return { costInUsd, costInLamports };
}

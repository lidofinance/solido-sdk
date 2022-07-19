import { SolidoSDK } from '@/index';
import { INSTRUCTION } from '@/constants';

export async function getTransactionInfo(this: SolidoSDK, instruction: INSTRUCTION) {
  const [exchangeRate, transactionCost, stakingRewardsFee] = await Promise.all([
    this.getExchangeRate(),
    this.getTransactionCost(instruction),
    this.getStakingRewardsFee(),
  ]);

  return {
    exchangeRate: {
      value: instruction === INSTRUCTION.STAKE ? exchangeRate.SOLToStSOL : exchangeRate.stSOLToSOL,
      description: exchangeRate.description,
    },
    transactionCost,
    stakingRewardsFee,
  };
}

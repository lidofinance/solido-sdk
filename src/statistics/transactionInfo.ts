import { SolidoSDK } from '@/index';
import { INSTRUCTION } from '@/constants';

export async function getTransactionInfo(this: SolidoSDK, instruction: INSTRUCTION) {
  const exchangeRate = await this.getExchangeRate();
  const transactionCost = await this.getTransactionCost(instruction);
  const stakingRewardsFee = this.getStakingRewardsFee();

  return {
    exchangeRate: {
      value: instruction === INSTRUCTION.STAKE ? exchangeRate.SOLToStSOL : exchangeRate.stSOLToSOL,
      description: exchangeRate.description,
    },
    transactionCost,
    stakingRewardsFee,
  }
}

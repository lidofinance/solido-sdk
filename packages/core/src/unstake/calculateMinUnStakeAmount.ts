import { StakeProgram } from '@solana/web3.js';
import { SolidoSDK } from '@/index';

export async function calculateMinUnStakeAmount(this: SolidoSDK) {
  const rentExem = await this.connection.getMinimumBalanceForRentExemption(StakeProgram.space);
  return rentExem;
}

import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { SolidoSDK } from '@/index';

export async function calculateMaxUnStakeAmount(this: SolidoSDK, address: PublicKey) {
  const [stSolAccount] = await this.getStSolAccountsForUser(address);

  const isUnStakeAvailable = await this.isUnStakeAvailable();

  if (!stSolAccount || !isUnStakeAvailable) {
    return 0;
  }

  const sourceStakeAccount = await this.calculateStakeAccountAddress();

  const stakeAccountBalance = await this.connection.getBalance(sourceStakeAccount);

  // https://github.com/ChorusOne/solido/blob/v0.5.0/program/src/processor.rs#L799
  const maxWithdrawAmount = stakeAccountBalance * 0.1 + 10 * LAMPORTS_PER_SOL;

  return Math.min(stSolAccount.balanceInLamports, maxWithdrawAmount);
}

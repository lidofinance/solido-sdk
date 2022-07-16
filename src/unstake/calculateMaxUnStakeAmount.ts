import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { SolidoSDK } from '@/index';

export async function calculateMaxUnStakeAmount(this: SolidoSDK, address: PublicKey) {
  const accountInfo = await this.connection.getAccountInfo(address);
  if (accountInfo === null) {
    return 0;
  }
  // @ts-ignore TODO
  const balanceInLamports = accountInfo.lamports;

  const sourceStakeAccount = await this.calculateStakeAccountAddress();

  const stakeAccountBalance = await this.connection.getBalance(sourceStakeAccount);

  // https://github.com/ChorusOne/solido/blob/v0.5.0/program/src/processor.rs#L799
  const maxWithdrawAmount = stakeAccountBalance * 0.1 + 10 * LAMPORTS_PER_SOL;

  return Math.min(balanceInLamports, maxWithdrawAmount);
}

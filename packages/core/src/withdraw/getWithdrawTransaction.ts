import { SolidoSDK } from '@/index';
import { WithdrawProps } from '@/types';
import { StakeProgram, TransactionInstruction } from '@solana/web3.js';

export async function getWithdrawTransaction(this: SolidoSDK, { accounts, payerAddress }: WithdrawProps) {
  const instructions = accounts.reduce((acc, { pubkey: stakePubkey, lamports }) => {
    const tx = StakeProgram.withdraw({
      stakePubkey,
      lamports,
      authorizedPubkey: payerAddress,
      toPubkey: payerAddress,
    });
    return [...acc, ...tx.instructions];
  }, [] as TransactionInstruction[]);

  const transaction = await this.createTransaction({ feePayer: payerAddress });
  transaction.add(...instructions);

  return { transaction };
}

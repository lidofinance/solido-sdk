import { SolidoSDK } from '@/index';
import { WithdrawProps } from '@/types';
import { StakeProgram, Transaction, TransactionInstruction } from '@solana/web3.js';

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

  const transaction = new Transaction({ feePayer: payerAddress });
  const { blockhash } = await this.connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  instructions.forEach((instruction) => {
    transaction.add(new TransactionInstruction(instruction));
  });

  return { transaction };
}

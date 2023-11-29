import { Keypair, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { SolidoSDK } from '@/index';

export type TransactionParts = {
  instructions: TransactionInstruction[];
  signers: Keypair[];
};

export function mergeTransactionParts(parts: TransactionParts[]) {
  return parts.reduce(
    (res, item) => ({
      instructions: [...res.instructions, ...item.instructions],
      signers: [...res.signers, ...item.signers],
    }),
    { instructions: [], signers: [] },
  );
}

export async function createTransaction(
  this: SolidoSDK,
  { feePayer }: { feePayer: PublicKey },
  ...parts: TransactionParts[]
) {
  const { blockhash } = await this.connection.getLatestBlockhash();

  const transaction = new Transaction();
  transaction.feePayer = feePayer;
  transaction.recentBlockhash = blockhash;

  const prepared = mergeTransactionParts(parts);
  prepared.instructions.forEach((i) => transaction.add(i));
  prepared.signers?.forEach((k) => transaction.partialSign(k));

  return transaction;
}

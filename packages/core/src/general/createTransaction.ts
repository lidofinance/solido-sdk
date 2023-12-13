import { SolidoSDK } from '@/index';
import { PublicKey, Transaction } from '@solana/web3.js';

export async function createTransaction(this: SolidoSDK, { feePayer }: { feePayer: PublicKey }) {
  const { blockhash } = await this.connection.getLatestBlockhash();

  const transaction = new Transaction();
  transaction.feePayer = feePayer;
  transaction.recentBlockhash = blockhash;

  return transaction;
}

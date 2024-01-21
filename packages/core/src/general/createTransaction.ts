import { SolidoSDK } from '@/index';
import { Keypair, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';

type TransactionParams = {
  feePayer: PublicKey;
  instructions?: TransactionInstruction[];
  signers?: Keypair[];
};

export async function createTransaction(
  this: SolidoSDK,
  { feePayer, instructions = [], signers = [] }: TransactionParams,
) {
  const { blockhash } = await this.connection.getLatestBlockhash();

  const transaction = new Transaction();
  transaction.feePayer = feePayer;
  transaction.recentBlockhash = blockhash;

  if (instructions.length > 0) {
    transaction.add(...instructions.map((i) => new TransactionInstruction(i)));
  }
  if (signers.length > 0) {
    transaction.partialSign(...signers);
  }

  return transaction;
}

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

  transaction.add(...instructions.map((i) => new TransactionInstruction(i)));
  transaction.partialSign(...signers);

  return transaction;
}

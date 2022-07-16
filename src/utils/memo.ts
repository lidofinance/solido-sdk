import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { MEMO_PROGRAM_ID } from '@/constants';

export const getMemoInstruction = (data: Record<string, string>, payerAddress: PublicKey) => {
  return new TransactionInstruction({
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from(JSON.stringify(data)),
    keys: [{ isSigner: true, isWritable: false, pubkey: payerAddress }],
  });
};

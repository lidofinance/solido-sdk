import { nu64, struct, u8 } from '@solana/buffer-layout';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import BN from 'bn.js';

import { INSTRUCTION } from '@/constants';
import { SolidoSDK } from '@/index';
import { InstructionStruct } from '@/types';

type DepositInstructionProps = {
  amount: number; // in SOL
  payerAddress: PublicKey;
  recipientStSolAddress: PublicKey;
};

export const depositDataLayout = struct<InstructionStruct>([u8('instruction'), nu64('amount')]);

// eslint-disable-next-line @typescript-eslint/require-await
export async function getDepositInstruction(this: SolidoSDK, props: DepositInstructionProps) {
  const { amount, payerAddress, recipientStSolAddress } = props;
  const { solidoProgramId, stSolMintAddress, solidoInstanceId, reserveAccount, mintAuthority } =
    this.programAddresses;

  const data = Buffer.alloc(depositDataLayout.span);

  depositDataLayout.encode(
    {
      instruction: INSTRUCTION.STAKE,
      amount: new BN(amount),
    },
    data,
  );

  const keys = [
    { pubkey: solidoInstanceId, isSigner: false, isWritable: true },
    { pubkey: payerAddress, isSigner: true, isWritable: true },
    { pubkey: recipientStSolAddress, isSigner: false, isWritable: true },
    { pubkey: stSolMintAddress, isSigner: false, isWritable: true },
    { pubkey: reserveAccount, isSigner: false, isWritable: true },
    { pubkey: mintAuthority, isSigner: false, isWritable: false },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: solidoProgramId,
    data,
  });
}

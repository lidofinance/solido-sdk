import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { struct, u8, nu64 } from '@solana/buffer-layout';
import BN from 'bn.js';

import { InstructionStruct } from '@/types';
import { INSTRUCTION } from '@/constants';
import { SolidoSDK } from '@/index';
import { solToLamports } from '@/utils/formatters';

type DepositInstructionProps = {
  amount: number; // in SOL
  payerAddress: PublicKey;
  recipientStSolAddress: PublicKey;
};

export async function findProgramAddress(
  this: SolidoSDK,
  bufferFrom: 'reserve_account' | 'mint_authority' | 'stake_authority',
) {
  const { solidoInstanceId, solidoProgramId } = this.programAddresses;
  const bufferArray = [solidoInstanceId.toBuffer(), Buffer.from(bufferFrom)];

  const [programAddress] = await PublicKey.findProgramAddress(bufferArray, solidoProgramId);

  return programAddress;
}

export const depositDataLayout = struct<InstructionStruct>([u8('instruction'), nu64('amount')]);

export async function getDepositInstruction(this: SolidoSDK, props: DepositInstructionProps) {
  const { amount, payerAddress, recipientStSolAddress } = props;
  const { solidoProgramId, stSolMintAddress, solidoInstanceId, reserveAccount, mintAuthority } =
    this.programAddresses;

  const data = Buffer.alloc(depositDataLayout.span);

  depositDataLayout.encode(
    {
      instruction: INSTRUCTION.STAKE,
      amount: new BN(solToLamports(amount)),
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

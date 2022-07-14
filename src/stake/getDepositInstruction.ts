import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { struct, u8, nu64 } from '@solana/buffer-layout';

import { InstructionStruct, Lamports } from '@/types';
import { INSTRUCTIONS } from '@/constants';
import { SolidoSDK } from '@/index';

type DepositInstructionProps = {
  amount: Lamports;
  payerAddress: PublicKey;
  recipientStSolAddress: PublicKey;
};

export async function findProgramAddress(this: SolidoSDK, bufferFrom: 'reserve_account' | 'mint_authority') {
  const { solidoInstanceId, solidoProgramId } = this.programAddresses;
  const bufferArray = [solidoInstanceId.toBuffer(), Buffer.from(bufferFrom)];

  const programAddress = await PublicKey.findProgramAddress(bufferArray, solidoProgramId);

  return programAddress[0];
}

export async function getDepositInstruction(this: SolidoSDK, props: DepositInstructionProps) {
  const { amount, payerAddress, recipientStSolAddress } = props;
  const { solidoProgramId, stSolMintAddress, solidoInstanceId } = this.programAddresses;

  const dataLayout = struct<InstructionStruct>([u8('instruction'), nu64('amount')]);
  const data = Buffer.alloc(dataLayout.span);

  dataLayout.encode(
    {
      instruction: INSTRUCTIONS.STAKE,
      amount: amount.lamports,
    },
    data,
  );

  const reserveAccount = await this.findProgramAddress('reserve_account');

  const mintAuthority = await this.findProgramAddress('mint_authority');

  const keys = [
    { pubkey: solidoInstanceId, isSigner: false, isWritable: true, },
    { pubkey: payerAddress, isSigner: true, isWritable: true },
    { pubkey: recipientStSolAddress, isSigner: false, isWritable: true, },
    { pubkey: stSolMintAddress, isSigner: false, isWritable: true, },
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
};

import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { struct, u8, nu64 } from '@solana/buffer-layout';
import BN from 'bn.js';

import { Lamports } from '@/types';
import { INSTRUCTIONS } from '@/constants';

export const calculateReserveAccount = async (lidoAddress, programId) => {
  const bufferArray = [lidoAddress.toBuffer(), Buffer.from('reserve_account')];

  const reserve = await PublicKey.findProgramAddress(bufferArray, programId);

  return reserve[0];
};

const calculateMintAuthority = async (lidoAddress, programId) => {
  const bufferArray = [lidoAddress.toBuffer(), Buffer.from('mint_authority')];

  const mint = await PublicKey.findProgramAddress(bufferArray, programId);

  return mint[0];
};

export type DepositInstructionProps = {
  amount: Lamports;
  payerAddress: PublicKey;
  recipientStSolAddress: PublicKey;
  solidoProgramId: PublicKey;
  solidoInstanceId: PublicKey;
  stSolMintAddress: PublicKey;
};

export type DepositInstructionStruct = {
  instruction: number;
  amount: BN;
};

export const getDepositInstruction = async (props: DepositInstructionProps) => {
  const { amount, payerAddress, recipientStSolAddress, solidoProgramId, stSolMintAddress, solidoInstanceId } =
    props;

  const dataLayout = struct<DepositInstructionStruct>([u8('instruction'), nu64('amount')]);
  const data = Buffer.alloc(dataLayout.span);

  dataLayout.encode(
    {
      instruction: INSTRUCTIONS.STAKE,
      amount: amount.lamports,
    },
    data,
  );

  const reserveAccount = await calculateReserveAccount(solidoInstanceId, solidoProgramId);

  const mintAuthority = await calculateMintAuthority(solidoInstanceId, solidoProgramId);

  const keys = [
    {
      pubkey: solidoInstanceId,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: payerAddress, isSigner: true, isWritable: true },
    {
      pubkey: recipientStSolAddress,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: stSolMintAddress,
      isSigner: false,
      isWritable: true,
    },
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

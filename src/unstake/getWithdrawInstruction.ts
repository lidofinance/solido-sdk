import {
  PublicKey,
  StakeProgram,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { nu64, struct, u8 } from '@solana/buffer-layout';

import { INSTRUCTIONS } from '@/constants';
import { InstructionStruct, Lamports } from "@/types";
import { SolidoSDK } from '@/index';

// TODO typings
export const calculateStakeAccountAddress = async (solidoInstanceId, programId, validatorVoteAccount, seed) => {
  const bufferArray = [
    solidoInstanceId.toBuffer(),
    validatorVoteAccount.toBuffer(),
    Buffer.from('validator_stake_account'),
    seed.toArray('le', 8),
  ];

  const [stakeAccountAddress] = await PublicKey.findProgramAddress(bufferArray, programId);

  return stakeAccountAddress;
};

// TODO typings for validatorEntries
export const getHeaviestValidator = (validatorEntries) => {
  const sortedValidatorEntries = validatorEntries.sort(
    ({ entry: validatorA }, { entry: validatorB }) =>
      validatorB.stake_accounts_balance.toNumber() - validatorA.stake_accounts_balance.toNumber(),
  );

  return sortedValidatorEntries[0];
};

type WithdrawInstructionProps = {
  amount: Lamports;
  payerAddress: PublicKey;
  senderStSolAccountAddress: PublicKey;
  stakeAccount: PublicKey;
};

export async function getWithdrawInstruction(this: SolidoSDK, props: WithdrawInstructionProps) {
  const { senderStSolAccountAddress, payerAddress, amount, stakeAccount } = props;
  const accountInfo = await this.getAccountInfo();

  const { solidoProgramId, stSolMintAddress, solidoInstanceId } = this.programAddresses;
  const dataLayout = struct<InstructionStruct>([u8('instruction'), nu64('amount')]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: INSTRUCTIONS.UNSTAKE,
      // TODO find out, what the lamports are
      amount: amount.lamports,
    },
    data,
  );

  const stakeAuthority = await this.findProgramAddress('stake_authority');
  // @ts-ignore TODO fix typings
  const validator = getHeaviestValidator(accountInfo.validators.entries);

  const validatorStakeAccount = await calculateStakeAccountAddress(
    solidoInstanceId,
    solidoProgramId,
    new PublicKey(validator.pubkey.toArray('le')),
    validator.entry.stake_seeds.begin,
  );

  const keys = [
    { pubkey: solidoInstanceId, isSigner: false, isWritable: true, },
    { pubkey: payerAddress, isSigner: true, isWritable: false },
    { pubkey: senderStSolAccountAddress, isSigner: false, isWritable: true, },
    { pubkey: stSolMintAddress, isSigner: false, isWritable: true, },
    { pubkey: new PublicKey(validator.pubkey.toArray('le')), isSigner: false, isWritable: false, },
    { pubkey: validatorStakeAccount, isSigner: false, isWritable: true },
    { pubkey: stakeAccount, isSigner: true, isWritable: true, },
    { pubkey: stakeAuthority, isSigner: false, isWritable: false },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: StakeProgram.programId, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    // @ts-ignore TODO fix
    solidoProgramId,
    data,
  });
};
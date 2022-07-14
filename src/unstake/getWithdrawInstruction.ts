import {
  PublicKey,
  StakeProgram,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { nu64, struct, u8 } from '@solana/buffer-layout';
import BN from 'bn.js';

import { INSTRUCTIONS } from '@/constants';
import { InstructionStruct } from '@/types';
import { SolidoSDK } from '@/index';

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

export const getHeaviestValidator = (validatorEntries) => {
  const sortedValidatorEntries = validatorEntries.sort(
    ({ entry: validatorA }, { entry: validatorB }) =>
      validatorB.stake_accounts_balance.toNumber() - validatorA.stake_accounts_balance.toNumber(),
  );

  return sortedValidatorEntries[0];
};

export async function getWithdrawInstruction(
  this: SolidoSDK,
  amount,
  payer,
  senderStSolAccountAddress,
  stakeAccount,
  accountInfo,
) {
  const { solidoProgramId, stSolMintAddress, solidoInstanceId } = this.programAddresses;
  const dataLayout = struct<InstructionStruct>([u8('instruction'), nu64('amount')]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: INSTRUCTIONS.UNSTAKE,
      amount: new BN(amount),
    },
    data,
  );

  const stakeAuthority = await this.findProgramAddress('stake_authority');
  const validator = getHeaviestValidator(accountInfo.validators.entries);

  const validatorStakeAccount = await calculateStakeAccountAddress(
    solidoInstanceId,
    solidoProgramId,
    new PublicKey(validator.pubkey.toArray('le')),
    validator.entry.stake_seeds.begin,
  );

  const keys = [
    { pubkey: solidoInstanceId, isSigner: false, isWritable: true, },
    { pubkey: payer, isSigner: true, isWritable: false },
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

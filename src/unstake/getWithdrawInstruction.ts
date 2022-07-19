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

import { INSTRUCTION } from '@/constants';
import { InstructionStruct, AccountInfo, Validator } from '@/types';
import { SolidoSDK } from '@/index';

export const getHeaviestValidator = (validatorEntries: AccountInfo['validators']['entries']) => {
  const sortedValidatorEntries = validatorEntries.sort(
    ({ entry: validatorA }, { entry: validatorB }) =>
      validatorB.stake_accounts_balance.toNumber() - validatorA.stake_accounts_balance.toNumber(),
  );

  return sortedValidatorEntries[0];
};

export async function calculateStakeAccountAddress(this: SolidoSDK, heaviestValidator?: Validator) {
  const { solidoInstanceId, solidoProgramId } = this.programAddresses;

  let validator = heaviestValidator;
  if (!validator) {
    const solidoAccountInfo = await this.getAccountInfo();
    validator = getHeaviestValidator(solidoAccountInfo.validators.entries);
  }

  const validatorVoteAccount = new PublicKey(validator.pubkey.toArray('le'));
  const seed = validator.entry.stake_seeds.begin;

  const bufferArray = [
    solidoInstanceId.toBuffer(),
    validatorVoteAccount.toBuffer(),
    Buffer.from('validator_stake_account'),
    seed.toArray('le', 8) as any as Uint8Array,
  ];

  const [stakeAccountAddress] = await PublicKey.findProgramAddress(bufferArray, solidoProgramId);

  return stakeAccountAddress;
}

type WithdrawInstructionProps = {
  amount: number;
  payerAddress: PublicKey;
  senderStSolAccountAddress: PublicKey;
  stakeAccount: PublicKey;
};

export async function getWithdrawInstruction(this: SolidoSDK, props: WithdrawInstructionProps) {
  const { senderStSolAccountAddress, payerAddress, amount, stakeAccount } = props;

  const { solidoProgramId, stSolMintAddress, solidoInstanceId } = this.programAddresses;
  const dataLayout = struct<InstructionStruct>([u8('instruction'), nu64('amount')]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: INSTRUCTION.UNSTAKE,
      amount: new BN(amount),
    },
    data,
  );

  const stakeAuthority = await this.findProgramAddress('stake_authority');

  const accountInfo = await this.getAccountInfo();

  const validator = getHeaviestValidator(accountInfo.validators.entries);

  const validatorStakeAccount = await this.calculateStakeAccountAddress(validator);

  const keys = [
    { pubkey: solidoInstanceId, isSigner: false, isWritable: true },
    { pubkey: payerAddress, isSigner: true, isWritable: false },
    { pubkey: senderStSolAccountAddress, isSigner: false, isWritable: true },
    { pubkey: stSolMintAddress, isSigner: false, isWritable: true },
    { pubkey: new PublicKey(validator.pubkey.toArray('le')), isSigner: false, isWritable: false },
    { pubkey: validatorStakeAccount, isSigner: false, isWritable: true },
    { pubkey: stakeAccount, isSigner: true, isWritable: true },
    { pubkey: stakeAuthority, isSigner: false, isWritable: false },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: StakeProgram.programId, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: solidoProgramId,
    data,
  });
}

import {
  PublicKey,
  StakeProgram,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { nu64, struct, u32, u8 } from '@solana/buffer-layout';
import BN from 'bn.js';

import { INSTRUCTION_V2 } from '@/constants';
import { Validator, WithdrawInstructionStruct } from '@/types';
import { SolidoSDK } from '@/index';
import { solToLamports } from '@/utils/formatters';
import { biToUint8Array } from '@/utils/biToUint8Array';

export const getHeaviestValidator = (validatorEntries: Validator[]): Validator =>
  validatorEntries.reduce((validatorB, validatorA) =>
    validatorB.effective_stake_balance > validatorA.effective_stake_balance ? validatorB : validatorA,
  );

export const getValidatorIndex = (validatorEntries: Validator[], validator: Validator) =>
  validatorEntries.findIndex(
    ({ vote_account_address: voteAccountAddress }) =>
      voteAccountAddress.toString() === validator.vote_account_address.toString(),
  );

export async function calculateStakeAccountAddress(this: SolidoSDK, heaviestValidator?: Validator) {
  const { solidoInstanceId, solidoProgramId } = this.programAddresses;

  let validator = heaviestValidator;
  if (!validator) {
    const validators = await this.getValidatorList();
    validator = getHeaviestValidator(validators);
  }

  const validatorVoteAccount = new PublicKey(validator.vote_account_address);
  const seed = validator.stake_seeds.begin;

  const bufferArray = [
    solidoInstanceId.toBuffer(),
    validatorVoteAccount.toBuffer(),
    Buffer.from('validator_stake_account'),
    biToUint8Array(seed),
  ];

  const [stakeAccountAddress] = await PublicKey.findProgramAddress(bufferArray, solidoProgramId);

  return stakeAccountAddress;
}

type WithdrawInstructionProps = {
  amount: number; // in stSOL
  payerAddress: PublicKey;
  senderStSolAccountAddress: PublicKey;
  stakeAccount: PublicKey;
};

export const withdrawDataLayout = struct<WithdrawInstructionStruct>([
  u8('instruction'),
  nu64('amount'),
  u32('validator_index'),
]);

export async function getWithdrawInstruction(this: SolidoSDK, props: WithdrawInstructionProps) {
  const { senderStSolAccountAddress, payerAddress, amount, stakeAccount } = props;
  const { solidoProgramId, stSolMintAddress, solidoInstanceId, stakeAuthority, validatorList } =
    this.programAddresses;

  const validators = await this.getValidatorList();

  const validator = getHeaviestValidator(validators);

  const data: Buffer = Buffer.alloc(withdrawDataLayout.span);
  withdrawDataLayout.encode(
    {
      instruction: INSTRUCTION_V2.UNSTAKE,
      amount: new BN(solToLamports(amount)),
      validator_index: getValidatorIndex(validators, validator),
    },
    data,
  );

  const validatorStakeAccount = await this.calculateStakeAccountAddress(validator);

  const keys = [
    { pubkey: solidoInstanceId, isSigner: false, isWritable: true },
    { pubkey: payerAddress, isSigner: true, isWritable: false },
    { pubkey: senderStSolAccountAddress, isSigner: false, isWritable: true },
    { pubkey: stSolMintAddress, isSigner: false, isWritable: true },
    { pubkey: new PublicKey(validator.vote_account_address), isSigner: false, isWritable: false },
    { pubkey: validatorStakeAccount, isSigner: false, isWritable: true },
    { pubkey: stakeAccount, isSigner: true, isWritable: true },
    { pubkey: stakeAuthority, isSigner: false, isWritable: false },
    { pubkey: validatorList, isSigner: false, isWritable: true },
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

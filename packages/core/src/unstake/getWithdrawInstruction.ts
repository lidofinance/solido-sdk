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

import { INSTRUCTION, INSTRUCTION_V2, LidoVersion } from '@/constants';
import { InstructionStruct, Validator, WithdrawInstructionStruct } from '@/types';
import { SolidoSDK } from '@/index';
import { solToLamports } from '@/utils/formatters';

export const getHeaviestValidator = (validatorEntries: Validator[]): Validator => {
  return validatorEntries.reduce((validatorB, validatorA) => {
    const { effective_stake_balance: effectiveStakeBalanceValidatorA } = validatorA;
    const { effective_stake_balance: effectiveStakeBalanceValidatorB } = validatorB;

    return effectiveStakeBalanceValidatorB.gt(effectiveStakeBalanceValidatorA) ? validatorB : validatorA;
  });
};

export const getValidatorIndex = (validatorEntries: Validator[], validator: Validator) =>
  validatorEntries.findIndex(
    ({ vote_account_address: voteAccountAddress }) =>
      voteAccountAddress.toString() === validator.vote_account_address.toString(),
  );

export async function calculateStakeAccountAddress(this: SolidoSDK, heaviestValidator?: Validator) {
  const { solidoInstanceId, solidoProgramId } = this.programAddresses;

  let validator = heaviestValidator;
  if (!validator) {
    const { validators } = await this.getAccountInfo();
    validator = getHeaviestValidator(validators);
  }

  const validatorVoteAccount = new PublicKey(validator.vote_account_address);
  const seed = validator.stake_seeds.begin;

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
  amount: number; // in stSOL
  payerAddress: PublicKey;
  senderStSolAccountAddress: PublicKey;
  stakeAccount: PublicKey;
};

export const withdrawDataLayout = {
  [LidoVersion.v1]: struct<InstructionStruct>([u8('instruction'), nu64('amount')]),
  [LidoVersion.v2]: struct<WithdrawInstructionStruct>([
    u8('instruction'),
    nu64('amount'),
    u32('validator_index'),
  ]),
};

export async function getWithdrawInstruction(this: SolidoSDK, props: WithdrawInstructionProps) {
  const { senderStSolAccountAddress, payerAddress, amount, stakeAccount } = props;

  const { solidoProgramId, stSolMintAddress, solidoInstanceId, stakeAuthority } = this.programAddresses;

  const { validators, accountInfo, lidoVersion } = await this.getAccountInfo();

  const validator = getHeaviestValidator(validators);

  const data: Buffer = Buffer.alloc(withdrawDataLayout[lidoVersion].span);
  if (lidoVersion === LidoVersion.v1) {
    withdrawDataLayout[lidoVersion].encode(
      {
        instruction: INSTRUCTION.UNSTAKE,
        amount: new BN(solToLamports(amount)),
      },
      data,
    );
  } else {
    withdrawDataLayout[lidoVersion].encode(
      {
        instruction: INSTRUCTION_V2.UNSTAKE,
        amount: new BN(solToLamports(amount)),
        validator_index: getValidatorIndex(validators, validator),
      },
      data,
    );
  }

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
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: StakeProgram.programId, isSigner: false, isWritable: false },
  ];

  if (lidoVersion === LidoVersion.v2) {
    // for v2 we will add also validator_list after stakeAuthority
    keys.splice(8, 0, {
      pubkey: new PublicKey(accountInfo.validator_list),
      isSigner: false,
      isWritable: true,
    });
  }

  return new TransactionInstruction({
    keys,
    programId: solidoProgramId,
    data,
  });
}

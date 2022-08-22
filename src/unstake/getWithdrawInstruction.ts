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

import { INSTRUCTION, LidoVersion } from '@/constants';
import { InstructionStruct, Validator, WithdrawInstructionStruct } from '@/types';
import { SolidoSDK } from '@/index';
import { solToLamports } from '@/utils/formatters';

export const getHeaviestValidator = (validatorEntries: Validator[]): Validator => {
  const sortedValidators = validatorEntries.sort(
    (validatorA, validatorB) =>
      validatorB.stake_accounts_balance.toNumber() - validatorA.stake_accounts_balance.toNumber(),
  );

  return sortedValidators[0];
};

const getValidatorIndex = (validatorEntries: Validator[], validator: Validator) =>
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

export async function getWithdrawInstruction(this: SolidoSDK, props: WithdrawInstructionProps) {
  const { senderStSolAccountAddress, payerAddress, amount, stakeAccount } = props;

  const { solidoProgramId, stSolMintAddress, solidoInstanceId } = this.programAddresses;

  const { validators, accountInfo, lidoVersion } = await this.getAccountInfo();

  const validator = getHeaviestValidator(validators);

  let data: Buffer;
  if (lidoVersion === LidoVersion.First) {
    const dataLayout = struct<InstructionStruct>([u8('instruction'), nu64('amount')]);

    data = Buffer.alloc(dataLayout.span);
    dataLayout.encode(
      {
        instruction: INSTRUCTION.UNSTAKE,
        amount: new BN(solToLamports(amount)),
      },
      data,
    );
  } else {
    const dataLayout = struct<WithdrawInstructionStruct>([
      u8('instruction'),
      nu64('amount'),
      u32('validator_index'),
    ]);

    data = Buffer.alloc(dataLayout.span);
    dataLayout.encode(
      {
        instruction: INSTRUCTION.UNSTAKE,
        amount: new BN(solToLamports(amount)),
        validator_index: getValidatorIndex(validators, validator),
      },
      data,
    );
  }

  const stakeAuthority = await this.findProgramAddress('stake_authority');

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

  if (lidoVersion === LidoVersion.Second) {
    // for v2 we will add also validators_list after stakeAuthority
    keys.splice(8, 0, {
      pubkey: new PublicKey(accountInfo.validators_list),
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

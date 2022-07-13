import {
  PublicKey,
  StakeProgram,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { nu64, struct, u8 } from '@solana/buffer-layout';
import { DepositInstructionStruct } from '@/stake/getDepositInstruction';
import { INSTRUCTIONS } from '@/constants';
import BN from 'bn.js';

export const calculateStakeAuthority = async (lidoAddress, programId) => {
  const bufferArray = [lidoAddress.toBuffer(), Buffer.from('stake_authority')];

  const mint = await PublicKey.findProgramAddress(bufferArray, programId);

  return mint[0];
};

export const calculateStakeAccountAddress = async (lidoAddress, programId, validatorVoteAccount, seed) => {
  const bufferArray = [
    lidoAddress.toBuffer(),
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

const getWithdrawInstructionKeys = async (
  payer,
  stSolAddress,
  destinationStakeAccount,
  accountInfo,
  { lidoAddress, stSolMint, programId },
) => {
  const stakeAuthority = await calculateStakeAuthority(lidoAddress, programId);
  const validator = getHeaviestValidator(accountInfo.validators.entries);

  const validatorStakeAccount = await calculateStakeAccountAddress(
    lidoAddress,
    programId,
    new PublicKey(validator.pubkey.toArray('le')),
    validator.entry.stake_seeds.begin,
  );

  return [
    {
      pubkey: lidoAddress,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: payer, isSigner: true, isWritable: false },
    {
      pubkey: stSolAddress,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: stSolMint,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: new PublicKey(validator.pubkey.toArray('le')),
      isSigner: false,
      isWritable: false,
    },
    { pubkey: validatorStakeAccount, isSigner: false, isWritable: true },
    {
      pubkey: destinationStakeAccount,
      isSigner: true,
      isWritable: true,
    },
    { pubkey: stakeAuthority, isSigner: false, isWritable: false },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: StakeProgram.programId, isSigner: false, isWritable: false },
  ];
};

export const getWithdrawInstruction = async (
  amount,
  payer,
  stSolAddress,
  stakeAccount,
  accountInfo,
  config,
) => {
  const { programId } = config;
  const dataLayout = struct<DepositInstructionStruct>([u8('instruction'), nu64('amount')]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: INSTRUCTIONS.UNSTAKE,
      amount: new BN(amount),
    },
    data,
  );

  const keys = await getWithdrawInstructionKeys(
    payer,
    stSolAddress,
    stakeAccount.publicKey,
    accountInfo,
    config,
  );

  return new TransactionInstruction({
    keys,
    programId,
    data,
  });
};
